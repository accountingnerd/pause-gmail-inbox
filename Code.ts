function myFunction() {
  const paused = GmailApp.getUserLabelByName('Inbox-Paused')
  const threads = paused.getThreads()
  for (const thread of threads) {
    Logger.log({ thread: thread.getFirstMessageSubject(), messageCount: thread.getMessageCount() })
    thread.moveToInbox();
    thread.removeLabel(paused)    
  }
}
