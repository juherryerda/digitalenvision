# digitalenvision

please run node index2.js to launch rest API

example:

POST http://localhost:8010/user/
BODY
{
"firstname":"john",
"lastname":"doe",
"bdate":"2017-03-29 4:00:00",   // birth day date
"location" : "7"                // 7 means GMT +7
}


please run node cron.js to activate crontask engine for birth day greeting

