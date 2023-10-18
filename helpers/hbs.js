//import modules and dependencies
const moment = require('moment') //to display date/time

module.exports = {
    //function to format date using moment
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    //function to format delete icon for user
    deleteIcon: function (post, loggedUser, postId) {
        if (post && loggedUser && post.creator && loggedUser._id) {
          if (post.creator._id.toString() === loggedUser._id.toString()) {
            return `
              <form action="/posts/delete/${post._id}" method="POST">
                <input type="hidden" name="_method" value="DELETE">
                <button type="submit" style = "background: none; border: none; cursor: pointer; padding: 0;">
                  <i class="fas fa-trash text-danger fa-lg"></i>
                </button>
              </form>
            `;
          } else {
            return '';
          }
        } else {
          return '';
        }
      },
}






