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
            <Navbar/>
            <header className="App-header">
                <Shows/>
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
                                        <img className="show-img my-1" sizes="(max-width: 575) 45vw, (max-width: 767) 26vw, 20vw" srcSet={small+item.poster_path+" 154w,"+ medium+item.poster_path+" 342w,"+large+item.poster_path+" 780w"} src={original+item.poster_path} alt={item.name}/>
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
                    <div className="banner" style={{backgroundImage: `url(${original}${info.backdrop_path})`,zIndex: '-1'}}>
                        <div className="background-gradient">
                            <div className="row">
                                <div className="col-12 col-md-4 my-3">
                                    <img className="show-img" srcSet={small+info.poster_path+" 154w,"+ medium+info.poster_path+" 342w,"+large+info.poster_path+" 780w"} src={original+info.poster_path} alt={info.name}/>
                                </div>
                                <div className="col-12 col-md-8 text-left my-3">
                                    <a href={info.homepage}><h1>{info.name} <small>({info.first_air_date.slice(0,4)})</small></h1></a>
                                    <div>
                                        {info.genres.map(item => (
                                            <span key={item.id.toString()} className="badge badge-light mr-2">
                                                {item.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="star-ratings-css">
                                        <div className="star-ratings-css-top" style={{width: `${(info.vote_average)*10}%`}}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                                        <div className="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span><span className="ml-3">{info.vote_average}</span></div>
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
class Navbar extends Component {
    render() {
        return (
                <nav className="navbar navbar-dark justify-content-between" style={{backgroundColor: '#563d7c'}}>
                    <a className="navbar-brand" href="/">Hook</a>
                    {/*<form className=" my-2 my-lg-0 d-flex d-md-none">*/}
                        {/*<input className="form-control mr-2 my-auto" type="search" placeholder="Search" aria-label="Search"/>*/}
                        {/*<button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Go</button>*/}
                    {/*</form>*/}
                    <form className="form-inline my-2 my-lg-0 d-none d-md-flex">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                        <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
                    </form>

                </nav>



        );
    }
}


export default App;
