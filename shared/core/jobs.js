zFramework.Jobs = {}

const citizen = {
    id: 1,
    name: "Citoyen",
    salary: 100,
    perks: { Open: true }
};

zFramework.Jobs[citizen.id] = citizen;

const taxi = {
    id: 2,
    name: "Taxi",
    salary: 50,
    perks: { Invoice: true, Open: true }
};

zFramework.Jobs[taxi.id] = taxi;

const livreur = {
    id : 3,
    name: "Livreur",
    salary: 50,
    perks: { Invoice: true, Open: true }
};

zFramework.Jobs[livreur.id] = livreur;

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