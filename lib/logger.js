const _ = require('lodash');
const log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console',
            category: 'console'
        },
        {
            type: 'dateFile',
            filename: 'logs/bleVirtualDevice.log',
            pattern: '_yyyy-MM-dd',
            alwaysIncludePattern: false,
            category: 'dateFileLog'
        }
    ],
    replaceConsole: true,
    levels: {
        console: 'info',
        dateFileLog: 'info'
    }
});

const dateFileLog = log4js.getLogger(_.isEqual(process.env.NODE_ENV, 'production') ? 'dateFileLog' : 'console');

module.exports = dateFileLog;