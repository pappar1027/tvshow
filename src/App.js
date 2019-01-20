import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//for responsive image loading
const imgbase = 'https://image.tmdb.org/t/p/';
const small = imgbase+'w154/';
const medium = imgbase+'w342/';
const large = imgbase+'w780/';
const original = imgbase+'original/';


class App extends Component {
  render() {
    return (
        <div className="App">
            <header className="App-header">
                <Shows></Shows>
            </header>
        </div>
    );
  }
}

class Shows extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        shows: []
    };
  }

  componentDidMount() {
    fetch("https://api.themoviedb.org/3/discover/tv?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&include_null_first_air_dates=false")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    shows: result.results
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
  }

  render() {
    const { error, isLoaded, shows } = this.state;
    if (error) {
        return <div className="py-5">Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div className="py-5">Loading...</div>;
    } else {
        return (
            <Router>
                <div className="centered">
                    <Route path="/" exact render={()=> (
                        <div className="row main-container my-5">
                            {shows.map(item => (
                                <div key={item.id.toString()} className="col-6 col-sm-4 col-md-3 p-1">
                                    <Link to={`/${item.id.toString()}`}>
                                        <img className="show-img" sizes="(max-width: 575) 45vw, (max-width: 767) 26vw, 20vw" srcSet={small+item.poster_path+" 154w,"+ medium+item.poster_path+" 342w,"+large+item.poster_path+" 780w"} src={original+item.poster_path} alt={item.name}/>
                                    </Link>
                                </div>

                            ))}
                        </div>
                    )}/>
                    <Route path="/:showId" component={Showpage}/>
                </div>
            </Router>



        );
    }
  }
}
//do a query to tv
class Showpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            info: null
        };
    }
    componentDidMount() {
        fetch(`https://api.themoviedb.org/3/tv/${this.props.match.params.showId}?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        info: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    render(){
        const { error, isLoaded, info } = this.state;
        if (error) {
            return <div className="py-5">Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div className="py-5">Loading...</div>;
        } else if (info){
            return (
                <div>
                    <div className="banner my-5" style={{backgroundImage: `url(${original}${info.backdrop_path})`,zIndex: '-1'}}>
                        <div className="background-gradient">
                            <div className="row">
                                <div className="col-12 col-md-4">
                                    <img className="show-img" srcSet={small+info.poster_path+" 154w,"+ medium+info.poster_path+" 342w,"+large+info.poster_path+" 780w"} src={original+info.poster_path} alt={info.name}/>
                                </div>
                                <div className="col-12 col-md-8 text-left">
                                    <a href={info.homepage}><h1>{info.name} <small>({info.first_air_date.slice(0,4)})</small></h1></a>
                                    <div className="star-ratings-css">
                                        <div className="star-ratings-css-top" style={{width: `${(info.vote_average)*10}%`}}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                                        <div className="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span><p>{info.vote_average}</p></div>
                                    </div>
                                    <h5>Overview:</h5>
                                    <p>{info.overview}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


            );
        }
        else {
            return (
                <div>No info is found.</div>
            );
        }
    }
}

class Trailer extends Component {

}


export default App;
