import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import Select from 'react-select'
import Genres from './genres'
import Navbar from './Navbar'


//for responsive image loading
const imgbase = 'https://image.tmdb.org/t/p/';
const small = imgbase+'w154/';
const medium = imgbase+'w342/';
const large = imgbase+'w780/';
const original = imgbase+'original/';

//for filtering
const sortby = [
    { value: 'popularity.desc', label: 'Popularity desc' },
    { value: 'vote_average.desc', label: 'Rating desc' },
];
const genres = Genres.genres;


class App extends Component {
  render() {
    return (
        <div className="App">
            <header className="App-header">
                <Shows/>
            </header>
        </div>
    );
  }
}

class Shows extends Component {
    state = {
        error: null,
        isLoaded: false,
        shows: [],
        sortBy: "popularity.desc",
        genre: ""

    };

  componentDidMount() {
      fetch(`https://api.themoviedb.org/3/discover/tv?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US&sort_by=${this.state.sortBy}&page=1&timezone=Asia%2FSingapore&include_null_first_air_dates=false`)
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
  onChange() {
      fetch(`https://api.themoviedb.org/3/discover/tv?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US&sort_by=${this.state.sortBy}&page=1&timezone=Asia%2FSingapore&include_null_first_air_dates=false&${this.state.genre}`)
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
    const { error, isLoaded, shows,sortBy,genre } = this.state;
    if (error) {
        return <div className="py-5">Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div className="py-5"><b>Loading...</b></div>;
    } else {
        return (
            <Router>
                <div>
                    <Navbar/>
                    <div className="centered">
                        <Route path="/" exact render={()=> (
                            <div className="row main-container my-4">
                                <Select options={sortby} onChange={value=> this.setState({sortBy: value.value},this.onChange)} defaultValue={sortby[0]} className="col-12 col-sm-6 px-1 py-1 py-sm-2 my-select"/>
                                <Select options={genres} onChange={value=> this.setState({genre: value.value},this.onChange)} defaultValue={genres[0]} className="col-12 col-sm-6 px-1 py-1 py-sm-2 my-select"/>
                                {shows.map(item => (
                                    <div key={item.id.toString()} className="col-6 col-sm-4 col-md-3 p-1 mb-1 align-self-center">
                                        <Link to={`/tv/${item.id.toString()}`}>
                                            {item.poster_path
                                                ? <img className="show-img" sizes="(max-width: 575) 45vw, (max-width: 767) 26vw, 20vw" srcSet={small+item.poster_path+" 154w,"+ medium+item.poster_path+" 342w,"+large+item.poster_path+" 780w"} src={original+item.poster_path} alt={item.name}/>
                                                : <p className="purple">(Poster Not Available)<br/>{item.name}</p>
                                            }
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}/>
                        <Route path="/search/:showName" component={Search}/>
                        <Route path="/tv/:showId" component={Showpage}/>
                        <Route path="/season/:seasonId/:showId" component={Season}/>
                    </div>
                </div>
            </Router>
        );
    }
  }
}
//do a query to tv details
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
            return <div className="py-5"><b>Loading...</b></div>;
        } else if (info){
            return (
                <div>
                    <div className="banner" style={{backgroundImage: `url(${original}${info.backdrop_path})`,zIndex: '-1'}}>
                        <div className="background-gradient">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-4 my-3">
                                    {info.poster_path
                                        ?<img className="show-img" sizes="(max-width: 767) 90vw, 20vw" srcSet={small+info.poster_path+" 154w,"+ medium+info.poster_path+" 342w,"+large+info.poster_path+" 780w"} src={original+info.poster_path} alt={info.name}/>
                                        : null
                                    }
                                </div>
                                <div className="col-12 col-md-8 col-xl-6 text-left my-3">
                                    <a href={info.homepage}><h1>{info.name} {info.first_air_date? <p>({info.first_air_date.slice(0,4)})</p>: null }</h1></a>
                                    <div>
                                        {info.genres.map(item => (
                                            <span key={item.id.toString()} className="badge badge-light mr-2">
                                                {item.name}
                                            </span>
                                        ))}
                                    </div>
                                    <Rating value={info.vote_average}/>
                                    <h5>Overview:</h5>
                                    <p>{info.overview}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="mt-3">Seasons</h3>
                    <div className="row justify-content-center">
                        {info.seasons.map(item => (

                            <div key={item.id.toString()} className="col-6 col-sm-4 col-md-3 p-0 m-1 card">
                                <Link to={`/season/${item.season_number}/${this.props.match.params.showId}`}>
                                    {item.poster_path
                                        ? <img className="card-img-top" sizes="(max-width: 575) 45vw, (max-width: 767) 26vw, 20vw" srcSet={small+item.poster_path+" 154w,"+ medium+item.poster_path+" 342w,"+large+item.poster_path+" 780w"} src={original+item.poster_path} alt={item.name}/>
                                        : null
                                    }
                                    <div className="card-body py-2">
                                        <p className="card-text">{item.name}</p>
                                    </div>
                                </Link>
                            </div>

                        ))}
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
// do a query for each season
class Season extends Component {
    constructor(props){
        super(props);
        this.state = {
            error:null,
            isLoaded :false,
            info:null
        }
    }
    componentDidMount() {
        fetch(`https://api.themoviedb.org/3/tv/${this.props.match.params.showId}/season/${this.props.match.params.seasonId}?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US`)
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
                <div className="background-gradient">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-4 my-3">
                            {info.poster_path
                                ?<img className="show-img" sizes="(max-width: 767) 90vw, 20vw" srcSet={small+info.poster_path+" 154w,"+ medium+info.poster_path+" 342w,"+large+info.poster_path+" 780w"} src={original+info.poster_path} alt={info.name}/>
                                : null
                            }
                        </div>
                        <div className="col-12 col-md-8 col-xl-6 text-left my-3">
                            <h1>{info.name} {info.air_date? <p>({info.air_date.slice(0,4)})</p>: null }</h1>
                            {info.overview?<h5>Overview:</h5>: null}
                            <p>{info.overview}</p>
                            <Link to={`/tv/${this.props.match.params.showId}`}>
                                <button type="button" className="btn btn-light">Back to show page</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="main-container m-auto">
                    {info.episodes.map(ep => (
                        <div key={ep.id.toString()} className="row my-2 py-3 text-left white-container">
                            <div className="col-12 col-md-4">
                                {ep.still_path
                                    ?<img className="show-img" sizes="(max-width: 767) 90vw, 20vw" srcSet={small+ep.still_path+" 154w,"+ medium+ep.still_path+" 342w,"+large+ep.still_path+" 780w"} src={original+ep.still_path} alt={ep.name}/>
                                    :null
                                }
                                <p className="text-center">Episode {ep.episode_number}</p>
                            </div>
                            <div className="col-12 col-md-8 pr-xl-5">
                                <h5>{ep.name}</h5>
                                <p>{ep.air_date}</p>
                                <Rating value={ep.vote_average}/>
                                <p>{ep.overview}</p>
                            </div>
                        </div>
                    ))}

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

class Rating extends Component {
    render(){
        return (
            <div className="star-ratings-css">
                <div className="star-ratings-css-top" style={{width: `${(this.props.value)*10}%`}}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span><span className="ml-3">{this.props.value}</span></div>
            </div>
        )
    }
}

// class Trailer extends Component {
//
// }


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error:null,
            isLoaded :false,
            results: []
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData () {
        fetch(`https://api.themoviedb.org/3/search/tv?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US&query=${this.props.match.params.showName}&page=1`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        results: result.results
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
    componentDidUpdate(prevProps) {
        if (this.props.match.params.showName !== prevProps.match.params.showName) {
            this.fetchData();
        }
    }
    render () {
        const { error, isLoaded, results } = this.state;
        if (error) {
            return <div className="py-5">Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div className="py-5"><b>Loading...</b></div>;
        } else{
            return (
                <div className="main-container m-auto">
                    <h2 className="text-left m-3">Search Results</h2>
                    {results.length == 0?<p className="text-left m-3">Sorry, no TV shows can be found.</p> : null}
                    {results.map(item => (
                        <div key={item.id.toString()} className="my-2 py-3 text-left white-container">
                            <Link to={`/tv/${item.id.toString()}`} className="row">
                                <div className="col-12 col-md-4">
                                    {item.poster_path
                                        ?<img className="show-img" sizes="(max-width: 767) 90vw, 20vw" srcSet={small+item.poster_path+" 154w,"+ medium+item.poster_path+" 342w,"+large+item.poster_path+" 780w"} src={original+item.poster_path} alt={item.name}/>
                                        :<p>Poster not available</p>
                                    }
                                </div>
                                <div className="col-12 col-md-8 pr-xl-5">
                                    <h5>{item.name} {item.first_air_date? <p>({item.first_air_date.slice(0,4)})</p>: null }</h5>
                                    <Rating value={item.vote_average}/>
                                    <p>Overview{item.overview}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            );
        }
    }
}


export default App;
