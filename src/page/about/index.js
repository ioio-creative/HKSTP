import React, {Component} from "react";
import { connect } from "react-redux";
import TweenMax, { TimelineMax } from 'gsap';
import smoothScroll from "../../_component/scroll";
import "../../sass/page/about.scss";

// const usePrevious = (value) => {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }


class About extends Component {
  static pageName = "about";

  constructor(props) {
    super(props);

    this.pageName = About.pageName;
    this.state = {
      activeId: null
    };
    this.about = null;
    this.smooth = null;
    this.openArticle = this.openArticle.bind(this);
    this.titleSpan = [];
  }

  // static actions = () => [fetchDataBy(this.pageName)];

  // static pushData = data => fetchDataSuccess(this.pageName, data);

  // componentDidMount() {
  //   if (!this.props.projectsData && this.props.match.params.lang === this.props.lang) {
  //     this.props.dispatch(fetchDataBy(this.pageName));
  //   }
  // }

  // shouldComponentUpdate(nextProps){
  //   if (nextProps.lang !== this.props.lang) {
  //     this.props.dispatch(fetchDataBy(this.pageName));
  //   }
  //   return true;
  // }

  componentDidUpdate(prevProps) {
    if(prevProps.page !== 'about' && this.props.page === 'about'){
      if(this.smooth){
        this.smooth.off();
        this.smooth.hideScrollBar();
        this.smooth = null;
      }
      this.smooth = new smoothScroll("#about #scrollWrap", (s, y, h) => {
      });
      this.smooth.on();
      this.smooth.showScrollBar();
      TweenMax.to(this.about, .6, {delay:1,autoAlpha:1});
      this.textAnim();
    }

    if(this.props.page !== 'about'){
      if(this.state.activeId !== null) this.setState({activeId: null})
    }
  }

  openArticle(e, idx){
    if(this.state.activeId !== idx){
      this.setState({activeId: idx});
      TweenMax.set(e.currentTarget.querySelector('.contentWrap'),{height:e.currentTarget.querySelector('.content').offsetHeight})
    }
    else{
      this.setState({activeId: null});
      TweenMax.set(e.currentTarget.querySelector('.contentWrap'),{height:0})
    }
  }

  textAnim(){
    if(this.props.data) {
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
    }
  }


  render() {
    if(this.props.page !== 'about'){
      return false;
    }

    if (this.props.data) {
      const data = this.props.data['about'];
      const homeData = this.props.data['home'];
      const globalData = this.props.data['global'];
      let i = 0;

      return(
        <div ref={elem => this.about = elem} id="about">
          <div id="scrollWrap">
            <div id="wrap">
              <div id="left">
                <h1 className="cap">
                  {`${this.props.lang === 'en' ?'About':'關於'}`.split("").map((value, idx) => {
                    return (
                      <span key={idx}>
                        <span ref={elem => (this.titleSpan[i++] = elem)}>
                          {value}
                        </span>
                      </span>
                    );
                  })}
                </h1>
              </div>
              <div id="right">
                <div id="lineWrap">
                  <div id="line"></div>
                </div>
                <div id="hof">
                  <h1 className="cap">
                    <span className="blue">{
                      homeData.title1.split("").map((value, idx) => {
                        return (
                          <span key={idx}>
                            <span ref={elem => (this.titleSpan[i++] = elem)}>
                              {value}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                    <span className="orange">
                      {homeData.title2.split("").map((value, idx) => {
                        return (
                          <span key={idx}>
                            <span ref={elem => (this.titleSpan[i++] = elem)}>
                              {value}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  </h1>
                </div>
                <div id="intro" className="contentWrap h5">
                  <div className="title">{globalData && globalData.introduction}</div>
                  <div dangerouslySetInnerHTML={{__html:data.introduction}} />
                  <div id="image"><img src={data.image.thumbnail} alt=""/></div>
                </div>

                <ul id="articles">
                  {
                    data.articles.map((value, idx)=>{
                      return (
                        <li key={idx} className={`h5 ${this.state.activeId === idx ? 'active' : ''}`} onClick={(e)=>{this.openArticle(e,idx)}}>
                          <div className="infoWrap">
                            <div className="title" dangerouslySetInnerHTML={{__html: value.name}} />
                            <span className="detailBtn">{globalData && this.state.activeId === idx ? globalData.hidedetails : globalData.moredetails}</span>
                          </div>
                          <div className="contentWrap">
                            <div className="content">
                              <div dangerouslySetInnerHTML={{__html: value.details}} />
                            </div>
                          </div>
                        </li>
                      )
                    })
                  }
                  <span id="title" className="cap">{globalData && globalData.article}</span>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    page: state.page,
    data: state.data ? state.data[state.lang] : null,
    // globalData: state.globalData
  };
};

export default connect(mapStateToProps)(About);
