# Free Inbox Pause #

There is a program/extension named after an Austrailian aboriginal weapon that
provides its users with a lot of extra features that make Gmail(r) better. I had been
using their system for a few years. I was a happy paying subscriber, but then 
Gmail(r) introduced quite a few native capabilities (like scheduled send and 
snooze), and then the aforementioned company raised their prices. All of a 
sudden I had $150/year worth of incentive to replace one small piece of 
functionality.

As you may know, CPA stands for "Cheapest Price Available", and I had a hunch
that this particular function (at least in the way that I used it) would be
fairly simple to implement with Google Apps script. And it was.

## Installation Guidance ##
I'm going to assume that you are already familiar with Google Apps script, and
that you aren't afraid to "get under the hood" to make some adjustments.

1. Install clasp: `npm install -g @google/clasp` OR `yarn global add @google/clasp`
2. Make a directory where the project will live: `mkdir unpause-inbox && cd unpause-inbox` 
3. Create the script: `clasp create --type script --title my-unpause-inbox`
4. Clone the project using your favorite tool: `git clone https://github.com/accountingnerd/pause-gmail-inbox.git`
5. Edit the appscript.json file to change the timezone to match your timezone. You might have
   to use your google-fu to figure out the correct time zone, but I have confidence that you
   can do it!
6. Push the project up with the command `clasp push`.
7. Edit the script properties of your script project at [https://script.google.com/](https://script.google.com/). You'll 
   need two properties:

    * `UNPAUSE_ON_WEEKENDS`: Valid values are 'true' and 'false' (no quotes).
    * `UNPAUSE_TIME`: Use the 24 hour clock to pick a time. If you use AM/PM, and want to 
      unpause at 4:30pm, then set the value to 16:30.
   
   NOTE: You had better format things correctly. This is running on your account, and if you mess
   up, it's all on you to fix it. Nobody is going to come rescue you.
8. Navigate to the script triggers, and create a new trigger to run "myFunction" on the "Head"
   deployment. The event source should be "Time-driven" and the time based trigger should be a
   minutes timer, with 10 minute intervals. There's probably a better way to do this, but this is how I set mine up.
9. Go into [Gmail](https://mail.google.com/).
    1. First, create a new label called "Inbox-Paused" (Be exact!).
    2. Next, create a filter to filter all our incoming mail into
       that label we just created, so that the unpause function can bring it in for us. Here's an example of a search string that I use. This allows important mail from the domain 
       mailinator.com and from myfamilydomain.org to come through immediately:
       `from:(*) label:inbox -{from:mailinator.com from:myfamilydomain.org}`
       You may get a warning from google about not selecting the 'inbox' label. It is safe to
       ignore that warning. On the filter, tick the box that says "Skip the Inbox (Archive it)" and also the 
       "Apply the label: Inbox-Paused". That's what makes the magic happen.
10. Go enjoy a virgin piña colada or your tasty beverage of choice. New email won't show up in your
    inbox until the script triggers the unpause function.

That's it! Inbox is paused, but if there's an emergency, you can always open that label to
find whatever you need.

## Updates/Contributing ##
I'm writing this in January of 2023 as a personal project. If all goes well, I will never have to
touch this thing again. If I update this project at all, it will be because something broke on 
my side. 

You should also be aware that I am not being particularly disciplined with git on this project, and I may `git push -f` 
on the main branch occasionally.

If you want new features, feel free to fork the project and add your own features.
If you submit a pull request it will probably be ignored. Don't feel bad.
