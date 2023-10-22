Feature: Channel support

    Scenario: New channel page

        Given I am an Admin in the poll app
        And I am logged in
        When I click on the "+ new" button
        And I select "create channel"
        Then I go to the create new channel page

    Scenario: Creating a channel

        Given I am an Admin in the poll app
        And I am logged in
        And I am at the create new channel page
        When I fill in the fields for name, category and owner
        And I press "Create channel"
        Then a new channel is created

    Scenario: Join channel page

        Given I am a User in the poll app
        And I am logged in
        When I click on the "+ new" button
        And I select "join channel"
        Then I go to the join channel page

    Scenario: Joining a channel

        Given I am a User in the poll app
        And I am logged in
        And I am at the join new channel page
        When I type in a channel name in the search box
        And click on the result I am interested in
        And click on the "Join channel" button
        Then a join channel request is send

    Scenario: View join requests

        Given I am a Channel owner in the poll app
        And I am logged in
        When I click on the "manage" button
        And I select "users"
        Then I can see users that request to join one of my channels
        And I can see which channel that I manage they want to join

    Scenario: Accept join requests

        Given I am a Channel owner in the poll app
        And I am logged in
        And I am at the channel users page
        When I select a user join request
        And I select "accept"
        Then the user has joined my channel
