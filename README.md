![CF](https://i.imgur.com/7v5ASc8.png)  Lab 08: SQL and Postgres
=======
[Code of Conduct](https://github.com/codefellows/code-of-conduct)

## Submission Instructions
When you are finished with lab, follow these steps to submit your work. Create one Pull Request (aka: "PR") from your Forked repo to the CF repo with your changes, and you'll each submit that same PR link in Canvas.

1. Ensure that all your local changes are committed, and pushed to your origin repo.
1. Visit the origin repo on github.com, and ensure that all of your completed work has been merged to master via Pull Requests within your repo.
1. Create a new PR from your Fork to the CF repo and ensure the branches look correct.
1. Fill in the template based on the text box prompts:
  1. Write a good descriptive summary of your changes:
    1. Be sure to include how much time you spent on it, and who you worked with.
    1. Briefly reflect on and summarize your process.
1. When you create the PR, it will have a unique URL. Copy this link, share with your partner, and paste it into the assignment submission form in Canvas. Both the driver and the navigator will submit the same PR link.
---

## Learning Objectives
- Understand the basic concepts of a database
- Effectively use basic SQL commands to create, read, update, and delete rows from a table

---

## Resources  
[SQL Syntax Cheatsheet](cheatsheets/sql.md)
[PostgreSQL Shell Cheatsheet](cheatsheets/postgress-shell.md)

---

## Feature Tasks  

1. Implement each of the new routes in your `server.js` file by completing each of the SQL statements and any associated data being handed through the request.
  * You may test each of these routes, by utilizing the corresponding Article prototype methods in the `article.js` file.
  * For example, the `app.post()` route in `server.js` corresponds to the `Article.prototype.insertRecord()` method in `article.js`. Once the SQL has been correctly entered to complete the route functionality, you will be able to create a new Article object, and call that method on it from the browser console. You can then check you postgres DB to confirm that it exists in the DB. It will also render to the page upon refreshing the browser.
  ```javascript
    // In the browser console
    let myArticle = new Article({title:'Flibbity goes Jibbiting', author:'Flibbity Jibbit', authorUrl:'flibbity.jibbit.com', category:'jibbits', publishedOn:'01-01-2217', body:'Flibbity Jibbit and the Key Keeper'});

    myArticle.insertRecord();
  ```
2. Complete the `fetchAll()` method so that data will populate our DB if it does not exist, otherwise render the articles in the DOM.

---

## Rubric

Criteria | Pts
---|---
Meets all Assignment Reqs | 6
Uses idiomatic code style | 3
Follows proper Git workflow | 1
**Total** | **10**
