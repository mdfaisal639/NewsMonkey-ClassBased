import React, { Component } from "react";
import Newsitem from "./Newsitem";
import Spinner from './Spinner'
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  PropTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  constructor(props) {
    super(props);
    // console.log("i am the constructor");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults:0
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )}-NewsMonkey`;
  }
  async updateNews() {
    this.props.setProgress(10);
    let url = ` https://newsapi.org/v2/top-headlines?&country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parseData = await data.json();
    // console.log(parseData);
    this.setState({
      articles: parseData.articles,
      totalResults: parseData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }
  fetchMoreData = async ()=>{
    this.setState({page:this.state.page +1})
    let url = `https://newsapi.org/v2/top-headlines?&country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize} `;
    // this.setState({ loading: true });
    let data = await fetch(url);
    let parseData = await data.json();
    // console.log(parseData);
    this.setState({
      articles: this.state.articles.concat(parseData.articles),
      totalResults: parseData.totalResults,
      // loading: false
    });

  }
  async componentDidMount() {
    // let url=` https://newsapi.org/v2/top-headlines?&country=${this.props.country}&category=${this.props.category}&apiKey=d925f79aba774891b8bd9bea820bfc79&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    // this.setState({loading:true})
    // let data=await fetch(url);
    // let parseData= await data.json();
    // console.log(parseData);
    // this.setState({articles:parseData.articles,totalResults:parseData.totalResults,loading:false});
    this.updateNews();
  }
    

  

  // handletoNext = async () => {
  //   if (
  //     this.state.page + 1 >
  //     Math.ceil(this.state.totalResults / this.props.pageSize)
  //   ) {
  //   } else {
  //     this.setState({
  //       page: this.state.page + 1,
  //     });

  //     this.updateNews();
  //   }
  // };
  // handletoPrevious = async () => {
  //   // let url=` https://newsapi.org/v2/top-headlines?&country=${this.props.country}&category=${this.props.category}&apiKey=d925f79aba774891b8bd9bea820bfc79&page=${this.state.page -1}&pageSize=${this.props.pageSize}`;
  //   // this.setState({loading:true})
  //   // let data=await fetch(url);
  //   // let parseData= await data.json();
  //   // // console.log(parseData);
  //   // this.setState(
  //   //   {

  //   //     articles:parseData.articles,
  //   //     page:this.state.page -1,
  //   //     loading:false
  //   //   });
  //   this.setState({
  //     page: this.state.page - 1,
  //   });
  //   this.updateNews();
  // };
  render() {
    return (
      <>
        <h1 className="text-center my-4">
          NewsMonkey-Top {this.capitalizeFirstLetter(this.props.category)}{" "}
          Headlines{" "}
        </h1>
        {this.state.loading && <Spinner/>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!==this.state.totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
          <div className="row">
            {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <Newsitem
                    title={element.title ? element.title : " "}
                    description={element.title ? element.description : ""}
                    imageUrl={
                      element.urlToImage
                        ? element.urlToImage
                        : "https://s.yimg.com/ny/api/res/1.2/OFxNi_5Aq6nFWwYRwngzeA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTY0MDtjZj13ZWJw/https://media.zenfs.com/en/fortune_175/600a5a0dea204cd9305c19f5b5e15402"
                    }
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
              
            })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            onClick={this.handletoPrevious}
            className="btn btn-dark "
          >
            &larr; Previous
          </button>
          <button
            type="button"
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            onClick={this.handletoNext}
            className="btn btn-dark"
          >
            Next &rarr;
          </button>
        </div> */}
         </>
      
    );
  }
 
}

export default News;
