import React from 'react';

const UserProfile = () => {
  return (
    <section className="py-10 my-auto mb-12 mt-8">
      <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
        <div className="lg:w-[88%] md:w-[80%] sm:w-[88%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center bg-white">
          <div>
            <h1 className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-5 text-gray-800">
              Profile
            </h1>
            <form>
              {/* Profile and Cover Images */}
              <div
                className="w-full rounded-sm bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxob21lfGVufDB8MHx8fDE3MTA0MDE1NDZ8MA&ixlib=rb-4.0.3&q=80&w=1080')] bg-cover bg-center bg-no-repeat items-center"
              >
                <div
                  id="profileImage"
                  className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-[url('../images/user.png')] bg-cover bg-center bg-no-repeat"
                >
                  <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                    <input type="file" name="profile" id="upload_profile" hidden required />
                    <label htmlFor="upload_profile">
                      <svg
                        data-slot="icon"
                        className="w-6 h-5 text-blue-700"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        ></path>
                      </svg>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <input type="file" name="profile" id="upload_cover" hidden required />
                  <div className="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                    <label htmlFor="upload_cover" className="inline-flex items-center gap-1 cursor-pointer">
                      Cover
                      <svg
                        data-slot="icon"
                        className="w-6 h-5 text-blue-700"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        ></path>
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
              <h2 className="text-center mt-1 font-semibold text-gray-600">Upload Profile and Cover Image</h2>

              {/* Name Input */}
              <div className="w-full mb-4 mt-6">
                <label htmlFor="name" className="mb-2 text-gray-600">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-2 p-4 w-full border-2 rounded-lg text-gray-700 border-gray-300 bg-gray-100"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Input */}
              <div className="w-full mb-4">
                <label htmlFor="email" className="mb-2 text-gray-600">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-2 p-4 w-full border-2 rounded-lg text-gray-700 border-gray-300 bg-gray-100"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone Number Input */}
              <div className="w-full mb-4">
                <label htmlFor="phone" className="mb-2 text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="mt-2 p-4 w-full border-2 rounded-lg text-gray-700 border-gray-300 bg-gray-100"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Sex and Date of Birth */}
              <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                <div className="w-full">
                  <h3 className="text-gray-600 mb-2">Gender</h3>
                  <select className="w-full text-gray-700 border-2 rounded-lg p-3 pl-2 pr-2 border-gray-300 bg-gray-100">
                    <option selected hidden value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="w-full">
                  <h3 className="text-gray-600 mb-2">Date Of Birth</h3>
                  <input
                    type="date"
                    className="text-gray-700 p-3 w-full border-2 rounded-lg border-gray-300 bg-gray-100"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end mt-6 gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
