'use strict';

/**
 * Set the value of COMPANY_DOMAIN to the domain your company uses for 
 * its JIRA app. It should be the same value you chose when updating
 * manifest.json.
 *
 * Ex: const COMPANY_DOMAIN = "googlecorp"
 */
const COMPANY_DOMAIN = "replacethiswithyourcompanydomain"

const LINK_PREFIX = "/browse/"
const FULL_LINK_PREFIX = "https://jira." + COMPANY_DOMAIN + ".com/browse/"

/**
 * Get JIRA issue links that are not configured to open in new tabs
 */
function getCandidateIssueLinks() {
    var links = Array.from(document.getElementsByTagName("a"));
    return links.filter(function(link) {
        return (link.hasAttribute("href") && (
            link.getAttribute("href").startsWith(LINK_PREFIX) ||
            link.getAttribute("href").startsWith(FULL_LINK_PREFIX)
        ) && link.target !== "_blank");
    });
}

/**
 * Update all JIRA issue links to open in new tabs when clicked
 */
function configureIssueLinksToOpenInNewTabs() {
    var issueLinks = getCandidateIssueLinks();
    issueLinks.forEach(function(link) {
        link.target = "_blank";

        // there are click listeners on the class "issue-link" that override the click event
        link.classList.remove("issue-link");
    });
}

const MUTATION_BUFFER = 1000
var lastMutation = null;

function waitForMutationsToComplete() {
    var currentTime = (new Date()).getTime();
    var remainingBuffer = MUTATION_BUFFER - (currentTime - lastMutation)
    if (remainingBuffer > 0) {
        setTimeout(waitForMutationsToComplete, remainingBuffer);
    } else {
        lastMutation = null;
        configureIssueLinksToOpenInNewTabs();
    }
}

function onContentMutation(mutationsList, contentObserver) {
    if (lastMutation == null) {
        setTimeout(waitForMutationsToComplete, MUTATION_BUFFER);
    }
    lastMutation = (new Date()).getTime();
}

function onBodyMutation(mutationsList, bodyObserver) {
    if (document.getElementById("content") != null) {
        bodyObserver.disconnect();
        var contentObserver = new MutationObserver(onContentMutation);
        contentObserver.observe(document.getElementById("content"), {
            childList: true,
            subtree: true
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var bodyObserver = new MutationObserver(onBodyMutation);
    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});