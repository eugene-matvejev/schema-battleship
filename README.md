[circle.ci-master-badge]: https://circleci.com/gh/eugene-matvejev/battleship-game-api-json-schema/tree/master.svg?style=svg
[circle.ci-master-link]: https://circleci.com/gh/eugene-matvejev/battleship-game-api-json-schema/tree/master


[slack_logo]: https://a.slack-edge.com/436da/marketing/img/slack_logo.png
[slack_url]: https://join.slack.com/t/myth-project/shared_invite/enQtMjk2NTM0MDA5ODQ3LTg3ZDlmYTBiODIwODI0ZjhhMjc2NTgwMDMwNDc0NWMxNzExYzliM2UwYTEzNGMyMGRiZjg0ZTEyOTYwYzM0OTQ

## join our [![join_us_on_slack][slack_logo]][slack_url] channel


|                     | master
|---                  |---
| __stub validation__ |
| _< Circle CI >_     | [![build][circle.ci-master-badge]][circle.ci-master-link]


# Battleship Game API responses/requests JSON schemas
the purpose of this repository is to store JSON schemas for the API responses|requests of the [battleship-game-api](https://github.com/eugene-matvejev/battleship-game-api) as well as some stubs which represets business logic _as schema can't always represent business logic_

so whenever you're testing front-end or back-end you can relay on schemas and stub - instead of using real back-end for request/receive data

_every JSON file is stored in_ '__PRETTY' format__

stubs are validated against schemas on every Pull Request | Commit

## THIS IS SPARE TIME PROJECT, WORK IN PROGRESS! HIGHLY EXPERIMENTAL!!!
## used technologies
 * node.js
 * jest
 * npm
 * yarn
 * composer
 * json
 * json schema

## how to install
 * php, composer
 composer provides opportunity to checkout [additional sources of the packages](https://getcomposer.org/doc/05-repositories.md#loading-a-package-from-a-vcs-repository)
 add another source into your __composer.json__:
 ```
 repositories": [
     { "type": "vcs", "url": "https://github.com/eugene-matvejev/battleship-game-api-json-schema" }
 ],
 ```
 `$ composer install eugene-matvejev/battleship-game-api-json-schema` consider use `--dev` flag to add in _devDependencies_ section
 * node.js, npm|yarn
  WIP

## how to run tests
 * `$ npm test`
