import { useEffect, useState } from "react"
import "./reset.css"
import "./style.css"
import { Route } from "react-router-dom";

const Acceuil = ()=>{
    const [nomPays, setNomPays] = useState("");
    const [population, setPopulation] = useState("");
    const [capital, setCapital] = useState("");
    const [currency, setCurrency] = useState("");
    let [isSubmitted, setIsSubmitted] = useState(false);

    const UNSPLASH_ACCESS_KEY = "";
    const urlsFetched: {[key:string]: string} = {};
    let activationVar: boolean = false;
    const appRoot = document.querySelector(".wrapper") as HTMLElement;
    const loader = document.querySelector(".loader") as HTMLElement;
    const head = document.querySelector(".head") as HTMLElement;
    // const returnBtn = document.querySelector(".returnBtn") as HTMLElement;
    let afficheHead: boolean = true;
    
    //Transition of loader
    const startTransition = () =>{
        loader.style.transform = "translateX(0%)";
        
    }

    const endTransition = () =>{
        loader.addEventListener("transitionend", () => {
            loader.style.transform = "translateX(100%)";

            // afficheHead = !afficheHead;

            if(afficheHead){
                head.style.display = "flex"
                appRoot.style.opacity = "0";
                appRoot.style.visibility = "hidden";
                appRoot.style.transform = "opacity 0.5s ease-in-out 0.9s, visibility 0.5s ease-out 1.9s"
                appRoot.style.pointerEvents = "none";
            }
            else{
                head.style.display = "none"
                appRoot.style.opacity = "1";
                appRoot.style.visibility = "visible";
                appRoot.style.transform = "opacity 0.5s ease-in 0.9s, visibility 0.5s ease-out 1.9s"
                appRoot.style.pointerEvents = "visible";
            }
        }, {once: true});
    }


    const onRouteChange = (route: any) => {
        startTransition();
        setTimeout(()=>{
            appRoot.dataset.route = route;
            endTransition();
        }, 500);
    }

    async function handleSubmit (e: any){
        e.preventDefault();
        activationVar = true;
        setIsSubmitted(true);
        onRouteChange("info");
        soap();
        afficheHead = false;
    }

    const handleReset = () =>{
        setNomPays("");
        setCapital("");
        setCurrency("");
        setIsSubmitted(false);
        setPopulation("");
        onRouteChange("form");
        afficheHead = true;
    }

    async function soap(){
        console.log("Vérification a l'ancienne :)");

        //build an soap request
        var request = 
            `<soapenv:Envelope 
                xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                xmlns:gs="http://spring.io/guides/gs-producing-web-service">
                <soapenv:Header/>
                <soapenv:Body>
                    <gs:getCountryRequest>
                        <gs:name>${nomPays}</gs:name>
                    </gs:getCountryRequest>
                </soapenv:Body>
            </soapenv:Envelope>`;

        try{
            const reponse = await fetch("http://localhost:8080/ws", {
                method: "POST",
                headers:{
                    "Content-Type": "text/xml",
                },
                body: request
            });

            if(reponse.ok){                     //ok: boolean indiquant succes de requete
                const text = await reponse.text();
                
                const parser = new DOMParser();
                const xmlVersion = parser.parseFromString(text,"text/xml");

                const resPopulation: string = xmlVersion.getElementsByTagName("ns2:population")[0].textContent ?? "not found";
                const resCapital: string = xmlVersion.getElementsByTagName("ns2:capital")[0]?.textContent ?? "not found";
                const resCurrency: string = xmlVersion.getElementsByTagName("ns2:currency")[0]?.textContent ?? "not found";

                setPopulation(resPopulation);
                setCapital(resCapital);
                setCurrency(resCurrency);
            }
            else{
                console.log("Error: Le fetch a echoue");
            }
        }
        catch (error){
            console.log("Error: Le fetch a echoue: "+ error);
        }
    }

    useEffect(()=>{
        const fetchImage = async ()=>{

            const queries = {
                population: "cityscape",
                pays: nomPays,
                monnaie: currency,
                cap: capital 
            }
            const newImg: Record<"population" | "pays" | "monnaie" | "cap", Blob > = {
                population: new Blob(),
                pays: new Blob(),
                monnaie: new Blob(),
                cap: new Blob()
            }

            for(const [key, query] of Object.entries(queries)){
                try{
                    //fetching image
                    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`,
                        {
                            method: "GET",
                        }
                    )
                    
                    //fetching error controle
                    if(!response.ok){
                        throw new Error(`Failed to fetch image for ${query}`);
                    }

                    //manipulating the reponse fetched
                    const blob = await response.blob(); 
                    newImg[key as keyof typeof newImg] = blob;

                    //transform blob to url
                    for( const [key, blob] of Object.entries(newImg)){
                        urlsFetched[key] = URL.createObjectURL(blob);
                    }

                }
                catch(error){
                    console.log("Error fetching no image registered");
                }
            };
        }
        fetchImage();
    }, [activationVar]);

    return(
        <>
        
            <div className="head">
                <form action="" method="post" onSubmit={handleSubmit}>
                    <div className="search-box">
                        <div className="row-x">
                            <input 
                                type="text"
                                placeholder="Entrer Pays"
                                autoComplete="off"
                                className="input-box"
                                onChange={(e) => setNomPays(e.target.value)}
                            />
                        </div>
                        <button type="submit">Recuperer</button>
                    </div>
                    
                </form>

            </div>

            <div className="loader"></div>

            <div className="wrapper">
                <div className="container">
                    <input type="radio" name="slide" id="c1" />
                    <label htmlFor="c1" className="card">
                        <div className="row">
                            <div className="icon">1</div>
                            <div className="description">
                                <h4>Population</h4>
                                <p> {population} </p>
                            </div>
                        </div>
                    </label>

                    <input type="radio" name="slide" id="c2" style={{backgroundImage: `url(${urlsFetched.pays || ""})`}}/>
                    <label htmlFor="c2" className="card">
                        <div className="row">
                            <div className="icon">2</div>
                            <div className="description">
                                <h4>Nom du pays</h4>
                                <p>{nomPays}</p>
                            </div>
                        </div>
                    </label>

                    <input type="radio" name="slide" id="c3"/>
                    <label htmlFor="c3" className="card" >
                        <div className="row">
                            <div className="icon">3</div>
                            <div className="description">
                                <h4>Capital</h4>
                                <p> {capital} </p>
                            </div>
                        </div>
                    </label>

                    <input type="radio" name="slide" id="c4"/>
                    <label htmlFor="c4" className="card" >
                        <div className="row">
                            <div className="icon">4</div>
                            <div className="description">
                                <h4>Currency</h4>
                                <p> {currency} </p>
                            </div>
                        </div>
                    </label>
                </div>
                <button  onClick={handleReset}> revoir </button>
            </div>

        </>
    );
}

export default Acceuil;