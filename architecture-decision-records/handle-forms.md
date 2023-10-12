# Handling forms and form data

## Issue

A large portion of the user interface will be forms. Building these in a uniform matter in styling, responsiveness, validations is a challenge.

Functional plugins also need configuration settings that have to be collected through forms. They want inputs, but not deal with UI functionality.

## Decision

1. We use a schema to define forms instead of composing them in react. This results
   in separation between logic and UI.
2. We use our own schema format to define the form, resulting in the most options and freedom
3. We leverage a library to take care of all remix related concepts (`remix-forms`) and convert our schema to a "zod" schema to relay our data structures and validations.
4. We build the forms using our own custom form fields that follow our own schema.
5. Our form fields interact with the remix form underneath, so that remix forms can do all its interactivity magic.
6. Our fields are plugins so that our system is extensible.

## Status

In progress

## Group

## Assumptions

Working with a set of pre-defined fields is good enough. And if a field type is missing, adding a new type should be easy and straightforward. This should be easier than setting a total rendering freedom to plugin authors for their form, because then they need to deal with more topics (responsiveness, validation, composition, theming, etc)

## Constraints

Since we are using remix we want to follow the remix flows, where forms are post-submits to the backend where the form is handled.
So we are not handling the forms on the client side and keep track of form state in the frontend.

## Positions

1. Make the plugin system free format. The plugin gets data and returns data, but does all form management though an open react component, making the plugin owner responsible of the form rendering and flow

2. Make plugin systems use a form schema. The schema reflects form elements like data type, field type and validation rules

3. Implement a fully custom system, where we control the schema. (More freedom, but more work)

4. Make use of a library, where the library owner controls the schema and form field availability. Offloading maintenance and updating to the library owner

## Argument

We explored all 4 positions:

| Position | Freedom of fields                  | Maintenance burden |
| -------- | ---------------------------------- | ------------------ |
| 1        | High                               | High               |
| 2        | High (through system wide plugins) | Low                |
| 3        | High                               | High               |
| 4        | Low                                | Low                |

Based on this the direction was to at least work with a schema.

In the end we decide to leverage as much as we can from a library (for lower maintenance burden, and getting a solid foundation from the outside), and place our own layer on top of it.

We will create our own schema. Convert it to a schema that the underlying library understands, use our schema for form buildup through our plugins (interfacing with the underlying library) and use all validation and backend handling through the underlying library.

## Implications

## Related decisions

## Related requirements

## Related principles

## Notes
