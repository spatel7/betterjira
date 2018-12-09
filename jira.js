'use strict';

const ORIGIN = window.location.origin;
const ISSUE_LINK_PREFIX = ORIGIN + "/browse/";

/**
 * Get JIRA external links and issue links that are not configured yet to
 * open in new tabs
 */
function getCandidateLinks() {
    var links = Array.from(document.getElementsByTagName("a"));
    return links.filter(function(link) {
        return (link.href && (
            link.href.startsWith(ISSUE_LINK_PREFIX) ||
            !link.href.startsWith(ORIGIN)
        ) && link.target !== "_blank");
    });
}

/**
 * Update all JIRA external links and issue links to open in new tabs
 */
function configureLinksToOpenInNewTabs() {
    var issueLinks = getCandidateLinks();
    issueLinks.forEach(function(link) {
        link.target = "_blank";

        // there are click listeners on the class "issue-link" that override the click event
        link.classList.remove("issue-link");
    });
}

const MUTATION_BUFFER = 500;
var lastMutation = null;

function waitForMutationsToComplete() {
    var currentTime = (new Date()).getTime();
    var remainingBuffer = MUTATION_BUFFER - (currentTime - lastMutation)
    if (remainingBuffer > 0) {
        setTimeout(waitForMutationsToComplete, remainingBuffer);
    } else {
        lastMutation = null;
        configureLinksToOpenInNewTabs();
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