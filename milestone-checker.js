"use latest";

var GitHubApi = require('github');
var githubClient = new GitHubApi({
	version: '3.0.0'
});

module.exports = function(context, done) {
	let githubToken = context.data.GITHUB_TOKEN;
	let milestoneEvent = context.data.milestone;
	let repo = context.data.repository;
	let action = context.data.action;

	if (!githubToken) {
		done(null, 'Missing GitHub token.');
	}

	if (!milestoneEvent) {
		done(null, 'Missing event data.');
		return;
	}

	if (!repo) {
		done(null, 'Missing repo data.');
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

			let title = 'Milestone ' + milestoneEvent.title + ' was closed incorrectly';
			let body = 'Milestone ' + milestoneEvent.title + ' (' + milestoneEvent.html_url + ') was closed with ' + openIssues + ' open issues. Those issues should have been closed first.';

			createIssue(githubClient, repo.owner.login, repo.name, title, body, function () {
					done(null, 'The milestone had some open issues! Notification issue has been created.'); 
				});

			return;
		}

		if (openIssues === 0 && closedIssues === 0) {
			console.log('Closing milestone without any issues.');
			
			let title = 'Milestone ' + milestoneEvent.title + ' was closed incorrectly';
			let body = 'Milestone ' + milestoneEvent.title + ' (' + milestoneEvent.html_url + ') was closed without any issues. It should have been deleted.';

			createIssue(githubClient, repo.owner.login, repo.name, title, body, function () { 
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

function createIssue(githubClient, user, repo, title, body, cb) {
	githubClient.issues.create({
			user: user,
			repo: repo,
			title: title,
			body: body
		}, function (err, data) {
			if (err) {
				console.log('Error when creating issue.');
				console.log(err);	
			} else {
				cb();
			}
		});
}
