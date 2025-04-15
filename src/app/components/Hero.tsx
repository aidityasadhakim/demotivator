const Hero = () => {
  return (
    <section className="w-full py-8 md:py-12 flex flex-col items-center text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          We MOTIVATE you
          <span className="block text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            to be <span className="text-sm text-gray-100 opacity-50">de</span>
            MOTIVATED!
          </span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          When you&apos;re feeling motivated to do something, we&apos;re here to help you
          reconsider. Our AI-powered{" "}
          <span className="text-sm text-gray-100 opacity-50">de</span>motivator
          will give you all the reasons not to bother.
        </p>

        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full inline-flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400 flex-wrap justify-center">
            <span className="px-3 py-1 m-0.5">Perfect for procrastinators</span>
            <span className="px-3 py-1 m-0.5">Instant regret</span>
            <span className="px-3 py-1 m-0.5">AI-powered excuses</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
