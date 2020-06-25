var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function () {
    // grab repo name from url query string
    var queryString = document.location.search;

    // split the bit at the '=' and second data in array
    var repoName = queryString.split("=")[1];

    // if search yields valid name
    if (repoName) {
        // put the repo name into the html
        repoNameEl.textContent = repoName;

        // pass split search to getRepoIssues()
        getRepoIssues(repoName);
    }
    else {
        // if not repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // make a request to url
    fetch(apiUrl).then(function (response) {
        // request was succesful
        if (response.ok) {
            response.json().then(function (data) {
                // pass response data to DOM function
                displayIssues(data);

                //check if api has paginated issues ie more than the 30 github allows
                if (response.headers.get(displayWarning(repo))) {
                    displayWarning(repo);
                }
            });
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function (issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create <span> element to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container, issueEl <a>
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        }
        else {
            typeEl.textContent = "(issue)";
        }

        // append to container, issueEl <a>
        issueEl.appendChild(typeEl);

        // append to container, issueContainerEl <main> <div>
        issueContainerEl.appendChild(issueEl);
    }    
};

var displayWarning = function (repo) {
    // add text to warning container, limitWarningEl <main> <div>
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    
    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on Github.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append link to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();