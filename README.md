# milestone-checker

A simple Webtask (https://webtask.io) that checks if a GitHub milestone has been properly closed

# How does it work?

The Webtask is fired by a webhook set in this repo for every milestone event. Whenever a milestone is closed, the Webtask checks if the milestone had any open tasks and if it had any tasks at all. A notification issue linking to the milestone is created if one of the rules is broken.

# How to test it?

1. Create some issues and assign them to a milestone (alpha, beta, rc, rtm).
1. Try closing a milestone that does not have any issues and see that a notification issue is created.
1. Try closing a milestone that has at least one open issue and see that a notification issue is created.

Please contact me if you need more privileges to test the Webtask.
