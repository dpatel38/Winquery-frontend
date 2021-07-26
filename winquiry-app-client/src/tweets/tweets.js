import React, { Component } from 'react';
import { TwitterTimelineEmbed } from "react-twitter-embed";


class Tweets extends Component {

render() {

    return (
      <div>
      <h2 style= {{color: 'white', textAlign: 'center', fontSize: "96px"}}> WIN Latest Tweets:</h2>
      <section className="twitterContainer">        
        <div className="twitter-embed">
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="CarolinaFintech"
            options={{
              tweetLimit: "10",
              width: "100%",
              height: "100%"
            }}
            theme="dark"
            noHeader="true"
            noBorders="true"
            noFooter="true"
          ></TwitterTimelineEmbed>
        </div>
      </section>
      </div>
    );
}

}

export default Tweets;

