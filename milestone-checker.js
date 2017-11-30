"use latest";

var GitHubApi = require('github');
var githubClient = new GitHubApi({
	version: '3.0.0'
});

module.exports = function(context, done) {
	let githubToken = context.data.GITHUB_TOKEN;
	let milestoneEvent = context.data.milestone;
	let action = context.data.action;

	if (!gitHubToken) {
		done(null, 'Missing GitHub token.');
	}

	if (!milestoneEvent) {
		done(null, 'Missing event data.');
		return;
	}

	githubClient.authenticate({
		type: 'oauth',
		token: githubToken
	});	

	if (action === 'closed') {
		
		console.log('Handling the closed event.');

		let openIssues = milestoneEvent.open_issues;
		let closedIssues = milestoneEvent.closed_issues;

		if (openIssues > 0) {
			console.log('Closing milestone with some open issues.');

			createIssue(githubClient, milestoneEvent.repository.owner.login, milestoneEvent.repository.name,
				function () {
					return 'Milestone ' + milestoneEvent.title + ' was closed with ' + openIssues + ' open issues.';
				},
				function (err, data) {
					done(null, 'The milestone had some open issues! Notification issue has been created.'); 
				});

			return;
		}

		if (openIssues === 0 && closedIssues === 0) {
			console.log('Closing milestone without any issues.');

			createIssue(githubClient, milestoneEvent.repository.owner.login, milestoneEvent.repository.name,
				function () {
					return 'Milestone ' + milestoneEvent.title + ' was closed without any issues. It should have been deleted.';
				},
				function () { 
					done(null, 'The milestone had no issues! Notification issue has been created.');
				});


			return;
		}
		
		console.log('The milestone was closed correctly.');

		done(null, 'The milestone was closed correctly!');

	} else {
		console.log('Nothing to do.');

		done(null, 'Nothing to do.');
	}
}

function createIssue(githubClient, owner, repo, messageFn, cb) {
	githubClient.issues.create({
			owner: owner,
			repo: repo,
			title: messageFn(),
			body: messageFn()
		}, function (err, data) {
			if (err) {
				console.log('Error when creating issue.');
				console.log(err);	
			} else {
				cb();
			}
		});
}
