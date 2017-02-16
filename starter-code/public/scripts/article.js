'use strict';

//Collaborators: Eve, Brandon, Morgan
function Article (opts) {
  // REVIEW: Convert property assignment to a new pattern. Now, ALL properties of `opts` will be
  // assigned as properies of the newly created article object. We'll talk more about forEach() soon!
  // We need to do this so that our Article objects, created from DB records, will have all of the DB columns as properties (i.e. article_id, author_id...)
  Object.keys(opts).forEach(function(e) {
    this[e] = opts[e]
  }, this);
}

Article.all = [];

// ++++++++++++++++++++++++++++++++++++++

// REVIEW: We will be writing documentation today for the methods in this file that handles Model layer of our application. As an example, here is documentation for Article.prototype.toHtml(). You will provide documentation for the other methods in this file in the same structure as the following example. In addition, where there are TODO comment lines inside of the method, describe what the following code is doing (down to the next TODO) and change the TODO into a DONE when finished.

/**
 * OVERVIEW of Article.prototype.toHtml():
 * - A method on each instance that converts raw article data into HTML
 * - Inputs: nothing passed in; called on an instance of Article (this)
 * - Outputs: HTML of a rendered article template
 */
Article.prototype.toHtml = function() {
  // DONE: Retrieves the  article template from the DOM and passes the template as an argument to the Handlebars compile() method, with the resulting function being stored into a variable called 'template'.
  var template = Handlebars.compile($('#article-template').text());

  // DONE: Creates a property called 'daysAgo' on an Article instance and assigns to it the number value of the days between today and the date of article publication
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // DONE: Creates a property called 'publishStatus' that will hold one of two possible values: if the article has been published (as indicated by the check box in the form in new.html), it will be the number of days since publication as calculated in the prior line; if the article has not been published and is still a draft, it will set the value of 'publishStatus' to the string '(draft)'
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';

  // DONE: Assigns into this.body the output of calling marked() on this.body, which converts any Markdown formatted text into HTML, and allows existing HTML to pass through unchanged
  this.body = marked(this.body);

// DONE: Output of this method: the instance of Article is passed through the template() function to convert the raw data, whether from a data file or from the input form, into the article template HTML
  return template(this);
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of Article.loadAll()
 * - Receives data from sql server and creates Article objects based on that sql data; Prepares sql data for use in html.
 * - Inputs: An array containing data queried from sql server
 * - Outputs: For every element in the rows array, create an Article object, assign date to object and store object on the Article all property
 */
Article.loadAll = function(rows) {
  // DONE: Sort data according to date. If result is less than 0, sort a to index than b, which means a comes first, if result is greater than 0, sort b to a lower index than a, which means b comes first.
  rows.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  // DONE: For every piece of data at each element in our rows array, instantiate an Article object based on that data and push object onto the all property attached to Article constructor
  rows.forEach(function(ele) {
    Article.all.push(new Article(ele));
  })
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of Artcle.fetchAll(callback)
 * - This method checks to see if records exist in the database, loads or creates the record depending on the result
 * - Inputs: Callback function of articleViewInitIndexPage, that comes from articleView.js, and is invoked on index.html
 * - Outputs:
 */
Article.fetchAll = function(callback) {
  // DONE: Calls an ajax selector for /articles location
  $.get('/articles')
  // DONE: Once /articles selector has been called, then it invokes an anonymous function, taking the results an argument, alluding to content .get
  .then(
    function(results) {
      if (results.length) { // If records exist in the DB
        // DONE: feed to Article.loadAll method, then invokes articleViewInitIndexPage through callback alias
        Article.loadAll(results);
        callback();
      } else { // if NO records exist in the DB
        // DONE: Pull records from ./data/hackerIpsum.json, push those records onto the database
        $.getJSON('./data/hackerIpsum.json')
        .then(function(rawData) {
          rawData.forEach(function(item) {
            let article = new Article(item);
            article.insertRecord(); // Add each record to the DB
          })
        })
        // DONE: After creating data in the database, calls itself with the intent of triggering executing block of statements in the if branch
        .then(function() {
          Article.fetchAll(callback);
        })
        // DONE: If output is something other than what is covered in the if/else throws an error and logs error to console
        .catch(function(err) {
          console.error(err);
        });
      }
    }
  )
};

// ++++++++++++++++++++++++++++++++++++++

//
/**
 * OVERVIEW of truncateTable
 * - Take callback as parameter and deletes data from table
 * - Inputs: Takes input from articles URL
 * - Outputs: Returns table minus the truncated data
 */
Article.truncateTable = function(callback) {
  // DONE: Calls ajax selector to articles and send a delete method (drops the table)
  $.ajax({
    url: '/articles',
    method: 'DELETE',
  })
  // DONE: Gets response from articleView, indicating data has been dropped from the server. Dropped data is then logged to console.
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  });
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of insertRecord
 * - Adds data to sql database
 * - Inputs: Article object instance to be stored in database
 * - Outputs: Logs newly inserted data
 */
Article.prototype.insertRecord = function(callback) {
  // insertRecord: Article object is sent to /articles for storage in database
   $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
  // insertRecord: let's us know that insertion of data onto server was successful
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  })
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of
 * - This method on the Article proto makes an AJAX HTTP request on an article of a particular ID and deletes it. After the AJAX call completes, the data that was deleted is logged, and if a callback function has been passed as an argument, it will run.
 * - Inputs: callback, and the id of the instance of the article that its called on
 * - Outputs: Logs deleted data from server
 */
Article.prototype.deleteRecord = function(callback) {
  // DONE: Ajax call accessing the article's id, performs a delete operation on the article on the database
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'DELETE'
  })
  // DONE: let's us know that deletion of the specific item was successful/ invokes callback if one is passed as an argument
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  });
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
* OVERVIEW of updateRecod
* - Describe what the method does: This method attaches a prototype of updateRecord to Article.  It uses AJAX to get a particular article id and puts the data listed into the table, if a callback function has been passed as an argument, it will run.
* - Inputs: article id and the data from the Article function
* - Outputs: the data added to the table
*/
Article.prototype.updateRecord = function(callback) {
 // DONE: AJAX call accessing at the particular articles id and updating the data listed below into the table
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'PUT',
    data: {  // DONE: this is giving the instances of the below data to be updated in the table
      author: this.author,
      authorUrl: this.authorUrl,
      body: this.body,
      category: this.category,
      publishedOn: this.publishedOn,
      title: this.title
    }
  })
 // DONE: This is indicating that after the above is inputted into the table then log the data added and if the callback function is there, run the callback function
 .then(function(data) {
   console.log(data);
   if (callback) callback();
 });
};
