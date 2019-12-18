import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateImageClickedIdx } from "../../../reducers";
import smoothScroll from "../../../_component/scroll";
import QRCode from "qrcode.react";
import '../../../sass/page/projectSingle.scss';

// import Html from "../../../_component/html";
import { TweenMax } from "gsap";

class ProjectSingle extends Component {
  static pageName = "projectSingle";

  static propTypes = {
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.pageName = ProjectSingle.pageName;
    this.state = {};
    this.smooth = null;
    this.projectSingle = null;
    this.closeBtn = null;
    this.onClick = this.onClick.bind(this);
  }
  
  componentDidUpdate(prevProps) {
    if(this.props.data){
      if(this.props.imageClickedIdx !== null){
        if(prevProps.imageClickedIdx !== this.props.imageClickedIdx){
          if(this.projectSingle){
            if(this.smooth){
              this.smooth.off();
              this.smooth.hideScrollBar();
              this.smooth = null;
            }
            this.smooth = new smoothScroll("#projectSingle #scrollWrap", (s, y, h) => {
              if(this.closeBtn)
                TweenMax.set(this.closeBtn,{force3D:true, y: Math.max(0, -y)});
            });
            this.smooth.on();
            this.smooth.showScrollBar();
            // TweenMax.set(this.projectSingle,{y:'0%'});
            TweenMax.to(this.projectSingle, .6, {delay:2,autoAlpha:1});
          }
        }
      }
      else if(prevProps.imageClickedIdx > -1 && this.props.imageClickedIdx === null){
        if(this.projectSingle){
          this.closeBtn = null;
          this.smooth.off();
          this.smooth.hideScrollBar();
          this.smooth = null;
          TweenMax.set(this.projectSingle,{y:'100%'});
        }
        // console.log(this.props.imageClickedIdx);
      }
    }
  }

  onClick(e){
    const video = e.currentTarget.parentNode.querySelector('video');
    if(video.paused){
      e.currentTarget.className = 'playing';
      video.play();
    }
    else{
      e.currentTarget.className = '';
      video.pause();
    }
  }

  render() {
    if(this.props.imageClickedIdx === null || !this.props.isStarted)
      return false;

    const data = this.props.data['projects'];
    const filteredData = [];
    
    // filtering data by category
    for(let i=0; i<data.items.length; i++){
      const value = data.items[i];
      if(this.props.category === ''){
        if(value.category.slug === data.categories[0].slug)
          filteredData.push(value);
      }
      else{
        if(value.category.slug === this.props.category) 
          filteredData.push(value);
      }
    }
    
    const fdata = filteredData[this.props.imageClickedIdx];
    const globalData = this.props.data['global'];


    if(this.props.data){
      return (
        <div ref={elem => this.projectSingle = elem} id="projectSingle">
          <div id="scrollWrap">
            <div ref={elem => this.closeBtn = elem} id="closeBtn" onClick={()=>{
              TweenMax.to(this.projectSingle, .3, {autoAlpha:0})
              this.props.dispatch(updateImageClickedIdx(null))
            }}><span></span><span></span></div>

            <div id="wrap">
              <div id="info">
                <div id="logo" className={fdata.images.logoresize?' small':''} style={{backgroundImage:`url('${fdata.images.logo}')`,backgroundColor:fdata.images.logoresize?fdata.images.logocolor:''}}></div>
                <div id="infoContent">
                  <h1>{fdata.name}</h1>
                  <div id="cat">{fdata.category.name}</div>
                  <div id="qrcode">
                    <QRCode value={fdata.website.url} renderAs="svg"/>
                  </div>
                </div>
              </div>
              <div id="content">
                <div id="intro" className="contentItem h5">
                  <div className="title">{globalData && globalData.introduction}</div>
                  <div dangerouslySetInnerHTML={{__html:fdata.details.introduction}} />
                  <div id="tags">
                    {fdata.details.tags.map((value, idx)=>{
                      return(
                        <span key={idx}>{value}</span>
                      )
                    })}
                  </div>
                </div>

                {
                  fdata.details.awards.length > 0 && <div id="awards" className="contentItem h5">
                    <div className="title">{globalData && globalData.awards}</div>
                    <ul>
                    {
                      fdata.details.awards.map((value, idx)=>{
                        return(
                          <li key={idx}>
                            <div className="year">{value.year}</div>
                            <div className="awradsTitle">{value.name}</div>
                            <div className="awradsResult">{value.result}</div>
                          </li>
                        )
                      })
                    }
                    </ul>
                  </div>
                }
                <div id="showcase" className="contentItem h6">
                  <div className="title h5">{globalData && globalData.showcase}</div>
                  <ul>
                  {
                    fdata.details.showcase.map((value, idx)=>{
                      return(
                        <li key={idx} className={value.type}>
                          {
                            value.src && 
                            <>
                            {value.type === 'image' && <img src={value.src} alt="" /> }
                            {value.type === 'video' && <div className="videoWrap"><span onClick={this.onClick}></span><video><source src={value.src} type="video/mp4"></source></video></div> }
                            {value.description && <div dangerouslySetInnerHTML={{__html:`<div class="wrap">${value.description}</div>`}} />}
                            </>
                          }
                        </li>
                      )
                    })
                  }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <></>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    data: state.data ? state.data[state.lang] : null,
    isStarted: state.isStarted,
    imageClickedIdx: state.imageClickedIdx,
    category: state.category,
  };
};

export default connect(mapStateToProps)(ProjectSingle);
