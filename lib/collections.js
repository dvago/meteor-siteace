Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

Websites.allow({
	update:function(userId, doc){
		if (Meteor.user()){ // if the user is logged in
			return true;
		} else { // the user is not logged in
			return false;
		}
	},

	insert:function(userId, doc){
		if (Meteor.user()){ // if the user is logged in
			return true;
		}
		else { // the user is not logged in
			return false;
		}
	},

	remove:function(userId, doc){
    if (Meteor.user()){ // if the user is logged in
		  return true;
    } else { // the user is not logged in
      return false;
    }
	}
});

Comments.allow({

	insert:function(userId, doc){
		if (Meteor.user()){ // if the user is logged in
			return true;
		}
		else { // the user is not logged in
			return false;
		}
	},

	remove:function(userId, doc){
    if (Meteor.user()){ // if the user is logged in
		  return true;
    } else { // the user is not logged in
      return false;
    }
	}
})
