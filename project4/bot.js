require('dotenv').config();
const m = require('masto')

const masto = m.createRestAPIClient({
    url: 'https://networked-media.itp.io',
    accessToken: process.env.TOKEN
})

const makeStatus = async (text) => {
    try {
        await masto.v1.statuses.create({
            status: text,
            visibility: 'public'
        });
        console.log('posted: ' + text);
    } catch (err) {
        console.log('error: ' + err.message);
    }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const schedule = ['feed #veryhungry', 'play #boooored', 'spank #needdiscipline', 'poop #helpcleanup', 'sleep! #nightnight']

// poop happens once a day at a random hour between 7am and 12am
const poopHour = Math.floor(Math.random() * 17) + 7;
console.log('poop scheduled for hour: ' + poopHour);

let lastHour = -1;

async function checkAndPost() {
    const hour = new Date().getHours();

    if (hour === lastHour) return;
    lastHour = hour;

    // sleep 12am - 7am
    if (hour >= 0 && hour < 7)  { await makeStatus(schedule[4]); return; }

    // feed at 8am, 12pm, 6pm
    if (hour === 8)  { await makeStatus(schedule[0]); }
    if (hour === 12) { await makeStatus(schedule[0]); }
    if (hour === 18) { await makeStatus(schedule[0]); }

    // poop once a day at random hour
    if (hour === poopHour) { await sleep(5000); await makeStatus(schedule[3]); }

    // play every 4 hours: 7am, 11am, 3pm, 7pm, 11pm
    if (hour === 7)  { await makeStatus(schedule[1]); }
    if (hour === 11) { await makeStatus(schedule[1]); }
    if (hour === 15) { await makeStatus(schedule[1]); }
    if (hour === 19) { await makeStatus(schedule[1]); }
    if (hour === 23) { await makeStatus(schedule[1]); }

    // spank every 6 hours: 7am, 1pm, 7pm
    if (hour === 7)  { await sleep(5000); await makeStatus(schedule[2]); }
    if (hour === 13) { await makeStatus(schedule[2]); }
    if (hour === 19) { await sleep(5000); await makeStatus(schedule[2]); }
}

checkAndPost();
setInterval(checkAndPost, 30 * 1000);