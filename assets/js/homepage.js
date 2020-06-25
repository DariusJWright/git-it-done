// variable linking to <form> element (submit)
var userFormEl = document.querySelector("#user-form");
// variable linking to <input> element (user input)
var nameInput = document.querySelector("#username");
// variable linking to <div> element that displays search results
var repoContainerEl = document.querySelector("#repos-container");
// variable linking to <span> element that displays search info
var repoSearchTerm = document.querySelector("#repo-search-term");
// variable linking to language buttons
var languageButtonsEl = document.querySelector("#language-buttons");

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
        // response successful and send data to displayRepos()
        if (response.ok) {
            response.json().then(function(data) {
                // send the response from the api and the user's search to displayRepos()
                displayRepos(data, user);
            });
        }
        // received 404 error from server
        else {
            alert("Error: " + response.statusText);
        }
    })
    // ⬇⬇⬇ ties into the fetch(apiUrl).then(function...) 
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    });
};  

// function that accepts arguments from getUserRepos() and displays them
var displayRepos = function (repos, searchTerm) {
    // if username doesn't have any repositories
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear old search content
    repoContainerEl.textContent = "";
    // replaces data in <span> element with the user's search received from getUserRepos(user) to displayRepos(searchterm) as an argument
    repoSearchTerm.textContent = searchTerm
    console.log(searchTerm);

    // loop over received repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name received from getUserRepos(data) to displayRepos(repos) as an argument
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

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

var getFeaturedRepos = function (language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                displayRepos(data.items, language);
            });
        }
        else {
            alert("Error: " + response.statusText);
        }
    });
};

var buttonClickHandler = function (event) {
    var language = event.target.getAttribute("data-language");
    console.log(language);

    if (language) {
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);