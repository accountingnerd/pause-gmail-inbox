function myFunction() {
    Logger.log({ logTime: new Date(), message: 'begin inbox unpause' })
    const myProperty = PropertiesService.getScriptProperties().getProperty;
    const timeStringToDate = (time: string): Date => {
        const timeParts = time
            .split(':')
            .concat(['0'])
            .map((part) => Number(part));
        const now = new Date();

        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            ...timeParts.map((part) => Number(part))
        );
    };

    const Prefs = {
        UNPAUSE_ON_WEEKENDS: JSON.parse(
            myProperty('UNPAUSE_ON_WEEKENDS') ?? 'false'
        ) as boolean,
        UNPAUSE_TIME: timeStringToDate(
            myProperty('UNPAUSE_TIME') ?? '16:30:00'
        ),
    };

    Logger.log(Prefs)

    enum Weekdays {
        SUNDAY = 0,
        MONDAY = 1,
        TUESDAY = 2,
        WEDNESDAY = 3,
        THURSDAY = 4,
        FRIDAY = 5,
        SATURDAY = 6,
    }
    const ERROR_AMOUNT = 6 * 60 * 1000; // 6 minutes of range in either direction around the time schedule

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = Number(now);
    const timeRangeStart = Number(Prefs.UNPAUSE_TIME) - ERROR_AMOUNT;
    const timeRangeEnd = Number(Prefs.UNPAUSE_TIME) + ERROR_AMOUNT;

    // Check to see if it's the weekend, and then unpause
    if (
        !Prefs.UNPAUSE_ON_WEEKENDS &&
        [Weekdays.SATURDAY, Weekdays.SUNDAY].includes(currentDay)
    )
        return;

    if (currentTime >= timeRangeEnd || currentTime <= timeRangeStart) return;

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
