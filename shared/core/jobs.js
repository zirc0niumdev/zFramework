zFramework.Jobs = {}

const citizen = {
    1: {
        name: "Citoyen",
        salary: 100,
        perks: { Open: true }
    }
};

zFramework.Jobs[Object.keys(citizen)[0]] = citizen[1];

const taxi = {
    2: {
        name: "Taxi",
        salary: 50,
        perks: { Invoice: true, Open: true }
    }
};

zFramework.Jobs[Object.keys(taxi)[0]] = taxi[2];

const livreur = {
    3: {
        name: "Livreur",
        salary: 50,
        perks: { Invoice: true, Open: true }
    }
};

zFramework.Jobs[Object.keys(livreur)[0]] = livreur[3];

//zFramework.SecondJobs = {}