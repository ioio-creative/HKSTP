import React, { Component } from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { TimelineMax, TweenMax } from "gsap";
import Html from "../../_component/html";
import { fetchDataBy, fetchDataSuccess } from "../../reducers";
import "../../sass/page/home.scss";

class Home extends Component {
  static pageName = "home";

  static propTypes = {
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.pageName = Home.pageName;
    this.state = {};
    this.titleSpan = [];
    this.done = false;
  }

  static actions = () => [fetchDataBy(this.pageName)];

  static pushData = data => fetchDataSuccess(this.pageName, data);

  componentWillMount() {
    if (!this.props.homeData) {
      this.props.dispatch(fetchDataBy(this.pageName));
    }
    // else {
    //   if (this.props.homeData.lang.split("-")[0] !== this.props.lang)
    //     this.props.dispatch(fetchDataBy(this.pageName));
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.props.lang) {
      this.props.dispatch(fetchDataBy(this.pageName));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.homeData && !this.done) {
      const tl = new TimelineMax({ paused: false });
      this.titleSpan.map((value, idx) => {
        const xory = Math.round(Math.random());
        value.style.willChange = "transform";
        const time = Math.random() * 0.5 + 0.8;
        xory === 0 ? 
          tl.fromTo( value, time , { x: Math.round(Math.random()) * 200 - 100 + "%" },{ x: 0 + "%", ease: "Expo.easeOut",
            onComplete: () => {
              value.style.willChange = "";
            }
          },Math.random())
        : 
          tl.fromTo(value, time,{ x: 0 + "%", y: Math.round(Math.random()) * 200 - 100 + "%" },{ y: 0 + "%",ease: "Expo.easeOut",
            onComplete: () => {
              value.style.willChange = "";
            }
          },Math.random());
      });
      this.done = true;
    }

    if(prevProps.isStarted !== this.props.isStarted){
      TweenMax.to(this.titleSpan, 1.3, {y:'-100%',ease:'Power4.easeInOut'});
    }
  }


  render() {
    if (this.props.homeData) {
      const data = this.props.homeData;
      let i = 0;

      return (
        <Html id="home" title="Home" description={`This is Home page!`}>
          <div id="title">
            <h1 className="cap">
              <div>
                {data.title1.split("").map((value, idx) => {
                  return (
                    <span key={idx}>
                      <span ref={elem => (this.titleSpan[i++] = elem)}>
                        {value}
                      </span>
                    </span>
                  );
                })}
              </div>
              <div>
                {data.title2.split("").map((value, idx) => {
                  return (
                    <span key={idx}>
                      <span ref={elem => (this.titleSpan[i++] = elem)}>
                        {value}
                      </span>
                    </span>
                  );
                })}
                <h1 className="cap">
                  {data.title3.split("").map((value, idx) => {
                    return (
                      <span key={idx}>
                        <span ref={elem => (this.titleSpan[i++] = elem)}>
                          {value === " " ? "\u00A0" : value}
                        </span>
                      </span>
                    );
                  })}
                </h1>
              </div>
            </h1>
          </div>
        </Html>
      );
    }
    return <h1>Loading...</h1>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    homeData: state.homeData ? state.homeData : null,
    isStarted: state.isStarted
  };
};

export default connect(mapStateToProps)(Home);
