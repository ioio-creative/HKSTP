import React, { Component } from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { TimelineMax, TweenMax } from "gsap";
// import { fetchDataBy, fetchDataSuccess } from "../../reducers";
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
    this.cloneTitle = null;
    this.done = false;
  }

  textAnim(){
    if (this.props.data && !this.done) {
      this.titleSpan = this.titleSpan.filter((el)=>{return el != null;});
      const tl = new TimelineMax({ delay:.8 });
      for(let i=0; this.titleSpan[i]; i++){
        const value = this.titleSpan[i];
        const xory = Math.round(Math.random());
        value.style.willChange = "transform";
        const time = Math.random() * 0.5 + 0.8;
        xory === 0 ? 
          tl.fromTo( value, time , { x: Math.round(Math.random()) * 200 - 100 + "%", autoAlpha:0 },{ x: 0 + "%", autoAlpha:1, overwrite:'all', ease: "Expo.easeOut",
            onComplete: () => {
              value.style.willChange = "";
            }
          },Math.random())
        : 
          tl.fromTo(value, time,{ x: 0 + "%", y: Math.round(Math.random()) * 200 - 100 + "%", autoAlpha:0 },{ y: 0 + "%", autoAlpha:1, overwrite:'all', ease: "Expo.easeOut",
            onComplete: () => {
              value.style.willChange = "";
            }
          },Math.random());
      }
      this.done = true;
    }
  }

  componentDidMount() {
    this.textAnim();
  //   if (!this.props.homeData && this.props.match.params.lang === this.props.lang) {
  //     this.props.dispatch(fetchDataBy(this.pageName));
  //   }
  }

  shouldComponentUpdate(nextProps){
    if (nextProps.lang !== this.props.lang && this.props.data && !this.props.isStarted) {
      if(this.cloneTitle)
        this.cloneTitle = null;
      this.cloneTitle = document.querySelector('#title > h1').cloneNode(true);
      this.cloneTitle.className = this.props.lang;
      document.querySelector('#title').appendChild(this.cloneTitle);
    }
    return true;
  }

  componentDidUpdate(prevProps){
    if(prevProps.data !== this.props.data)
      this.textAnim();

    if(prevProps.lang !== this.props.lang && !this.props.isStarted){

      this.done = false;
      
      if(this.cloneTitle){
        TweenMax.fromTo(this.cloneTitle.querySelectorAll('span > span'),.8, {y:0}, {y:'-100%',ease:'Power4.easeInOut',
          onComplete: ()=>{
            this.cloneTitle.remove();
          }
        })
      }
      TweenMax.set(this.titleSpan, {y:'0%'});
      this.textAnim();
    }
    else{
      if(prevProps.isStarted && !this.props.isStarted){
        this.done = false;
        TweenMax.set(this.titleSpan, {y:'0%'});
      }
      this.textAnim();
    }

    if(prevProps.isStarted !== this.props.isStarted && this.props.isStarted){
      TweenMax.to(this.titleSpan, 1.3, {y:'-100%', overwrite:'all', ease:'Power4.easeInOut'});
    }
  }


  render() {
    this.titleSpan = [];
    if (this.props.data) {
      const data = this.props.data['home'];
      let i = 0;

      return (
        <div id="home" className={this.props.page}>
          <div id="title">
            <h1 className="cap">
              <div className="blue">
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
                    <span key={idx} className="orange">
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
        </div>
      );
    }
    return <h5 className="loading">Loading...</h5>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    data: state.data ? state.data[state.lang] : null,
    isStarted: state.isStarted,
    page: state.page
  };
};

export default connect(mapStateToProps)(Home);
