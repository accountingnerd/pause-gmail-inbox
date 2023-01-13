function myFunction() {

    enum DAYS {
        SUNDAY = 0,
        MONDAY = 1,
        TUESDAY = 2,
        WEDNESDAY = 3,
        THURSDAY = 4,
        FRIDAY = 5,
        SATURDAY = 6,
    }
    const UNPAUSE_AT_HOUR = 16
    const UNPAUSE_AT_MINUTE = 30
    const UNPAUSE_ON_WEEKENDS = false

    const ERROR_AMOUNT = 9

    const currentTime = new Date()
    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()
    const currentDay = currentTime.getDay()

    if (!UNPAUSE_ON_WEEKENDS && (currentDay == DAYS.SATURDAY || currentDay == DAYS.SUNDAY)) return;
    
    if ( UNPAUSE_AT_HOUR !== currentHour) return;
    if (currentMinute < UNPAUSE_AT_MINUTE - ERROR_AMOUNT || currentMinute > UNPAUSE_AT_MINUTE + ERROR_AMOUNT) return;



    const paused = GmailApp.getUserLabelByName('Inbox-Paused');
    const threads = paused.getThreads();
    for (const thread of threads) {
        Logger.log({
            thread: thread.getFirstMessageSubject(),
            messageCount: thread.getMessageCount(),
        });
        thread.moveToInbox();
        thread.removeLabel(paused);
    }
}
