/// routing

Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
    this.render('main_nav', {
        to: "main_nav"
    });
    this.render('website_list', {
        to: "main"
    });
});

Router.route('/website/:_id', function() {
    this.render('main_nav', {
        to: "main_nav"
    });
    this.render('website', {
        to: "main",
        data: function() {
            return Websites.findOne({
                _id: this.params._id
            });
        },
        onAfterRun: function() {
            document.title = this.params;
        }
    });
});

/////
// template search events
/////

Template.searchbox.events({
    'click .js-search, keyup .js-search': function(event) {
        var searchVal = $('.searchbox input').val();
        Session.set("keyword", searchVal);
    },
});

/////
// template helpers
/////

// helper function that returns all available websites
Template.website_list.helpers({
    websites: function() {
        if (Session.get("keyword")) {
            return Websites.find({
                title: {
                    $regex: ".*" + Session.get("keyword") + ".*"
                }
            }, {
                sort: {
                    votes: -1
                }
            });
        } else {
            return Websites.find({}, {
                sort: {
                    votes: -1
                }
            });
        }
    },
    filtering_list: function() {
        if (Session.get("keyword")) { // the user set a search
            return true;
        } else {
            return false;
        }
    }
});


Template.comment_list.helpers({
    comments: function() {
        return Comments.find({
            reference: this._id
        }, {
            sort: {
                createdOn: -1
            }
        });
    }
});

/////
// template events
/////

Template.website_item.events({
    "click .js-upvote": function(event) {
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        var currentVote = this.votes;
        // put the code in here to add a vote to a website!

        if (Meteor.user()) { // if the user is logged in
            // put the code in here to remove a vote from a website!

            if (Meteor.user()) { // if the user is logged in
                currentVote += 1;

                Websites.update(website_id, {
                    $set: {
                        votes: currentVote
                    },
                });
            }
        }

        return false; // prevent the button from reloading the page
    },
    "click .js-downvote": function(event) {

        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        var currentVote = this.votes;

        // put the code in here to remove a vote from a website!

        if (Meteor.user()) { // if the user is logged in
            if (currentVote > 0) {
                currentVote -= 1;

                Websites.update(website_id, {
                    $set: {
                        votes: currentVote
                    },
                });
            }
        }

        return false; // prevent the button from reloading the page
    }
})

/////
// template comments events
/////

Template.comment_form.events({
    "click .js-toggle-comment-form": function(event) {
        $("#comment_form").toggle('slow');
    },
    "submit .js-save-comment-form": function(event) {

        var description = event.target.description.value;
        var reference = this._id;
        //  put your website saving code in here!
        if (Meteor.user()) { // if the user is logged in

            Comments.insert({
                message: description,
                reference: reference,
                createdOn: new Date()
            });

            // reset the form value after submission
            event.target.description.value = '';

        } else {
            console.log('you must be logged in');
        }

        return false; // stop the form submit from reloading the page

    }
});


Template.website_form.events({
    "click .js-toggle-website-form": function(event) {
        $("#website_form").toggle('slow');
    },

    "submit .js-save-website-form": function(event) {

        // here is an example of how to get the url out of the form:
        var url = event.target.url.value;
        var title = event.target.title.value;
        var description = event.target.description.value;

        //  put your website saving code in here!
        if (Meteor.user()) { // if the user is logged in
            Websites.insert({
                title: title,
                url: url,
                description: description,
                votes: 0,
                createdOn: new Date()
            });

            // reset the form values after submission
            event.target.url.value = '';
            event.target.title.value = '';
            event.target.description.value = '';

        } else {
            console.log('you must be logged in');
        }

        return false; // stop the form submit from reloading the page

    }
});


// Format date helper
Template.registerHelper('formatDate', function(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
});
