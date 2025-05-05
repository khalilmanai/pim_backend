const InfractionContract = artifacts.require('Lock'); // if contract name is Lock

module.exports = async function (callback) {
  try {
    const instance = await InfractionContract.deployed();
    const count = await instance.getInfractionCount();
    console.log('Total infractions:', count.toString());

    for (let i = 0; i < count; i++) {
      const infraction = await instance.getInfraction(i);
      console.log(`Infraction ${i}:`, {
        hash: infraction[0],
        timestamp: new Date(infraction[1].toNumber() * 1000).toLocaleString(),
        plate: infraction[2],
        type: infraction[3],
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
  callback();
};
