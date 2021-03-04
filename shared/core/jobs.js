zFramework.Jobs = {}

const citizen = {
    id: 1,
    name: "Citoyen",
    salary: 10,
    perks: { Open: true }
};

zFramework.Jobs[citizen.id] = citizen;

const lsms = {
    id: 2,
    name: "LSMS",
    salary: 120,
    perks: { Invoice: true }
};

zFramework.Jobs[lsms.id] = lsms;

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