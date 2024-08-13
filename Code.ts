function myFunction() {
    Logger.log({ logTime: new Date(), message: 'begin inbox unpause' })
    const myProperty = PropertiesService.getScriptProperties().getProperty
    const timeStringToDate = (time: string): Date => {
        const timeParts = time
            .split(':')
            .concat(['0'])
            .map((part) => Number(part))
        const now = new Date()

        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...timeParts.map((part) => Number(part)))
    }

    enum Weekdays {
        SUNDAY = 0,
        MONDAY = 1,
        TUESDAY = 2,
        WEDNESDAY = 3,
        THURSDAY = 4,
        FRIDAY = 5,
        SATURDAY = 6,
    }

    const Prefs = {
        UNPAUSE_ON_WEEKENDS: JSON.parse(myProperty('UNPAUSE_ON_WEEKENDS') ?? 'false') as boolean,
        UNPAUSE_TIME: (myProperty('UNPAUSE_TIME') ?? '16:30:00').split(',').map(timeStringToDate),
        // UNPAUSE_TIME: (UNPAUSE_TIME).split(',').map(timeStringToDate),
        UNPAUSE_DAYS: (myProperty('UNPAUSE_DAYS') ?? 'SATURDAY,SUNDAY').split(',').map((day) => Weekdays?.[day] ?? undefined).filter((e) => e !== undefined),
        // UNPAUSE_DAYS: UNPAUSE_DAYS.split(',').map((day) => Weekdays?.[day] ?? undefined).filter((e) => !!e,
    }

    console.log(Prefs.UNPAUSE_DAYS)
    console.log(Prefs.UNPAUSE_TIME)

    const now = new Date()
    const currentDay = now.getDay()
    // Check to see if it's the weekend, and then unpause
    // if (!Prefs.UNPAUSE_ON_WEEKENDS && [Weekdays.SATURDAY, Weekdays.SUNDAY].includes(currentDay)) return
    console.log('Includes current day:', Prefs.UNPAUSE_DAYS, currentDay)
    if (!Prefs.UNPAUSE_DAYS.includes(currentDay)) return
   
    const ERROR_AMOUNT = 6 * 60 * 1000 // 6 minutes of range in either direction around the time schedule
    const currentTime = Number(now)
    // Check if current time is within any of the unpause time ranges
    const unpauseTimes = Prefs?.UNPAUSE_TIME ?? []
    const isWithinUnpauseRange = unpauseTimes.length > 0 && unpauseTimes.some(unPauseTime => {
        const timeDiff = Math.abs(Number(unPauseTime) - currentTime);
        return timeDiff <= ERROR_AMOUNT;
    });

    // If not within any range, return
    if (!isWithinUnpauseRange) return

    const paused = GmailApp.getUserLabelByName('Inbox-Paused')
    const threads = paused.getThreads()
    console.log('threads:', threads?.length)
    for (const thread of threads) {
        Logger.log({
            thread: thread.getFirstMessageSubject(),
            messageCount: thread.getMessageCount(),
        })
        thread.moveToInbox()
        thread.removeLabel(paused)
    }
}
