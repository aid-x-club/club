export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
          <span className="text-[80px] md:text-[120px] font-bold text-[#222222] opacity-70">
            4
          </span>
          <div>
            <img
              src="https://xubohuah.github.io/xubohua.top/Group.png"
              alt="Ghost"
              className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-contain"
              draggable="false"
            />
          </div>
          <span className="text-[80px] md:text-[120px] font-bold text-[#222222] opacity-70">
            4
          </span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-[#222222] mb-4 md:mb-6 opacity-70">
          Boo! Page missing!
        </h1>
        
        <p className="text-lg md:text-xl text-[#222222] mb-8 md:mb-12 opacity-50">
          Whoops! This page must be a ghost - it&apos;s not here!
        </p>

        <div className="mb-12">
          <button 
            onClick={() => window.history.back()}
            className="inline-block bg-[#222222] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#000000] transition-colors"
          >
            Go back
          </button>
        </div>

        <div>
          <button
            onClick={() => alert('404 means the page was not found on the server.')}
            className="text-[#222222] opacity-50 hover:opacity-70 transition-opacity underline"
          >
            What means 404?
          </button>
        </div>
      </div>
    </div>
  );
}
