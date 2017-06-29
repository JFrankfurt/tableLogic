/*
 > You are implementing the back-end of a spreadsheet (like a similar version of Excel or Google Sheets).
 > You have a front-end developer who will be responsible for communicating with the user for things like rendering and handling user input.

 > We will be providing the front-end developer two functions:
 > # set_cell(C1, 45) or set_cell(C1, =A1+B1) for formulas
 > # get_value(C1) (returns an integer)

 > * How should we store the state of the spreadsheet internally?

 > We do not need the full features of a spreadsheet but we do need the ability to allow a cell to refer to other cells and to sum values from other cells. Bias towards simplicity.

 Example:
 >______A______B______C___
 > 1 |__3___|__5___|______
 > 2 |______|______|=A1+B1
 */

class Spreadsheet {
    constructor(store) {
        this.store = store;
    };

    setValue(cellRef, newVal) {

        let intermediateVal = this.parseFunc(this.store[cellRef][0])
        if (Array.isArray(intermediateVal)) {
            intermediateVal.map((el) => {
                this.store[el][1] = this.store[el][1].filter((dep) => dep !== cellRef);
            });
        }

        intermediateVal = this.parseFunc(newVal[0]);
        if (Array.isArray(intermediateVal)) {
            this.store[cellRef] = intermediateVal.map((el) => this.store[el][1].push(cellRef));
        } else {
            this.store[cellRef] = [newVal, [...this.store[cellRef][1]]]
        }
        return this.store[cellRef][1];
    }

    getValue(cellRef) {
        let intermediateVal = this.parseFunc(this.store[cellRef][0]);
        return Array.isArray(intermediateVal) ? intermediateVal.reduce((acc, cur) => {
            return acc + this.getValue(cur)
        }, 0) : parseInt(intermediateVal);
    }

    parseFunc(funcStr) {
        return funcStr[0] === "=" ? funcStr.substr(1).split("+") : funcStr;
    }

    log(...args) {
        if (args.length > 0) {
            args.map((arg) => console.log(arg));
        } else {
            console.log(this.store);
        }
    }
}

let store = {
    "A1": ["3", ["C2"]], // [value, [deps]]
    "B1": ["5", ["C2"]],
    "C2": ["=A1+B1", []]
};

let s1 = new Spreadsheet(store);
s1.log(s1.getValue("A1"), "^should be 3 \n");
s1.log(s1.getValue("C2"), "^should be 8 \n");
s1.log(s1.setValue("A1", "9"), "^should be C2 \n");
s1.log(s1.setValue("C2", "0"), "^should be empty and no elements should contain C2 in their deps. \n");
s1.log(); //logs the current state
