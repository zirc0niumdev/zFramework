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

zFramework.Jobs.GetJobFromId = id => {
	return new Promise((resolve, reject) => {
        const job = zFramework.Jobs[id];
		if (!job) reject(console.error("can't get job with id: " + id));
		
		resolve(job);
	});
}

zFramework.Jobs.GetJobNameFromId = async id => {
    const job = await this.GetJobFromId(id);

    return job.name;
}