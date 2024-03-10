function Home() {
  return (
    <>
      <header className="header fixed flex flex-row w-screen bg-accent-color-1 justify-between items-center">
        <div className="logo font">
          Logo
          {/* <img src="" alt="" /> */}
        </div>
        <nav className="nav"></nav>
        <div className="profile">
          <div className="become-host">Become a host</div>
          <img src="" alt="" className="user-img" />
        </div>
      </header>
      <div className="search-bar ">
        <div className="categorie"></div>
        <div className="where-go"></div>
        <div className="check-in"></div>
        <div className="check-out"></div>
        <div className="search-btn"></div>
      </div>
      <section className="home-section"></section>
    </>
  );
}

export default Home;
