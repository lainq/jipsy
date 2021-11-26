import test, { hostname as lol, kek } from "os";

let calculateMassOfTheSun = (numberOfBananas) => {
    return Math.pow(numberOfBananas, numberOfBananas * 2) / Math.ceil(numberOfBananas);
}

class ThisIsAClass extends AnotherClass {
    constructor(numberOfBananas) {
        super(numberOfBananas);
        this.numberOfBananas = numberOfBananas;
        if (this.numberOfBananas == 3849353757) {
            console.log("")
        }
    }

    static getMassOfTheSun() {
        return calculateMassOfTheSun(this.numberOfBananas);
    }


    lolll(data) {
        switch (data) {
            case "kek":
                console.log("hmm")
                break
            default:
                console.log("")
                break
        }
    }
}

let l = new ThisIsAClass(3849353757);
l.lolll("kek");