// variable linking to <form> element (submit)
var userFormEl = document.querySelector("#user-form");
// variable linking to <input> element (user input)
var nameInput = document.querySelector("#username");
// variable linking to <div> element that displays search results
var repoContainerEl = document.querySelector("#repos-container");
// variable linking to <span> element that displays search info
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function (event) {
    event.preventDefault();
    // variable for the user's search value with blank space trimmed off
    var username = nameInput.value.trim();

    // if username is not blank, send it as an argument to getUserRepo()
    if (username) {
        getUserRepos(username);
        nameInput.value = "";
    }
    else {
        alert("Please enter a GitHub username");
    }
};

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data){
            // send the response from the api and the user's search to displayRepos()
            displayRepos(data, user);
        });
    });
};  

// function that accepts arguments from getUserRepos() and displays them
var displayRepos = function (repos, searchTerm) {
    // clear old search content
    repoContainerEl.textContent = "";
    // replaces data in <span> element with the user's search received from getUserRepos(user) to displayRepos(searchterm) as an argument
    repoSearchTerm.textContent = searchTerm
    console.log(repos);
    console.log(searchTerm);

    // loop over received repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name received from getUserRepos(data) to displayRepos(repos) as an argument
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a <span> element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container repoEl <div> ⬆⬆⬆
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container (statusEl) to container: repoEl <div>
        repoEl.appendChild(statusEl);

        // append container (repoEl) to <main> <div>
        repoContainerEl.appendChild(repoEl);
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);