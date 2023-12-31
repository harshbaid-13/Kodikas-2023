"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { setUser } from "@Reducers/features/user";
import { useDispatch, useSelector } from "react-redux";
import { setTeam, setTeamRequest } from "@Reducers/features/team";
import { setProfile } from "@Reducers/features/profile";
import { setRequest } from "@Reducers/features/requests";
import "./Nav.css";

import { Preahvihear } from "next/font/google";
import { useRouter } from "next/navigation";
import axios from "axios";
// import { logo } from ".@/public";

const preahvihear = Preahvihear({
  subsets: ["latin"],
  weight: ["400"],
});

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const profileCompleted = useSelector(
    (state) => state.profile.isProfileCompleted
  );
  const user = useSelector((state) => state.user.user);
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  useEffect(() => {
    const setProvidersFunc = async () => {
      const response = await getProviders();
      // console.log(response);
      setProviders(response);
    };
    setProvidersFunc();
  }, []);

  const getRequests = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/team/confirm`
      );
      dispatch(setRequest(data.data));
    } catch (err) {
      console.log(err);
    }
  };
  const setUserdata = () => {
    dispatch(setUser(session?.user));
  };
  const getTeamDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/team`
      );
      dispatch(setTeam(data.data === undefined ? null : data.data));
      dispatch(
        setTeamRequest(data.request === undefined ? null : data.request)
      );
    } catch (err) {
      console.log(err);
    }
  };
  const getProfileDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`
      );
      // const { data } = await res.json();
      dispatch(setProfile(data.data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (session) {
      setUserdata();
      getTeamDetails();
      getProfileDetails();
      getRequests();
    } else {
      dispatch(setUser(null));
    }
  }, [session]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    if (isMainMenuOpen) {
      setIsMainMenuOpen(false);
    }
  };

  const toggleMainMenu = () => {
    setIsMainMenuOpen(!isMainMenuOpen);
    if (isUserDropdownOpen) {
      setIsUserDropdownOpen(false);
    }
  };

  const navbarRef = useRef(null);

  const handleDocumentClick = (event) => {
    // console.log("clicked");
    if (
      !navbarRef.current?.contains(event.target) &&
      (isUserDropdownOpen || isMainMenuOpen)
    ) {
      setIsUserDropdownOpen(false);
      setIsMainMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [navbarRef, isUserDropdownOpen, isMainMenuOpen]);

  // useEffect(() => {
  //   getRequests();
  // }, [userId]);

  return (
    <nav className="z-20 bg-white text-white body-font">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/images/logo.png"
            className="h-8 mr-3"
            alt="Kodikas Logo"
            height={50}
            width={40}
          />
          <span
            className="self-center text-3xl font-semibold whitespace-nowrap text-headerText"
            id="logoTag"
          >
            <span className={preahvihear.className}>Kodikas-2K23</span>
          </span>
        </Link>
        {user ? (
          <div className="flex items-center md:order-2">
            <div className="relative">
              <button
                type="button"
                className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0"
                id="user-menu-button"
                aria-expanded={isUserDropdownOpen}
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
                onClick={toggleUserDropdown}
              >
                <span className="sr-only">Open user menu</span>
                <Image
                  className="w-8 h-8 rounded-full border-2 border-subHeaderText"
                  src={user?.image}
                  alt="user photo"
                  height={50}
                  width={50}
                />
              </button>
              {/* User toggle menu */}
              <div
                className={`${isUserDropdownOpen ? "block" : "hidden"
                  } absolute right-0 mt-2 text-base list-none bg-white divide-y rounded-lg shadowdivide-gray-600 z-20`}
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-subHeaderText">
                    <span className={preahvihear.className}>
                      {/* Sign Out */}
                      {user?.name}
                    </span>
                  </span>
                  <span className="block text-sm text-gray-500 truncate ">
                    <span className={preahvihear.className}>
                      {/* Sign Out */}
                      {user?.email}
                    </span>
                  </span>
                </div>
                <ul
                  className="py-2 flex flex-col"
                  aria-labelledby="user-menu-button"
                >
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-xl text-gray-900 hover:bg-gray-100 mb-2"
                    >
                      <span className={preahvihear.className}>My Profile</span>
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="relative inline-flex items-center ml-2 justify-center p-0.5 pr-2 mb-2  overflow-hidden text-xs font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-btnColorDark to-btnColor group-hover:from-btnColorDark group-hover:to-btnColor hover:text-white  focus:ring-4 focus:outline-none focus:ring-purple-200 "
                    >
                      <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white text-gray-700 rounded-md hover:text-gray-100 group-hover:bg-opacity-0">
                        <span className={preahvihear.className}>Sign Out</span>{" "}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            {/* Main menu button */}
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center  p-2 w-10 h-10 justify-center text-sm  rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-headerText font-bold "
              aria-controls="navbar-user"
              aria-expanded={isMainMenuOpen}
              onClick={toggleMainMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-10 h-10"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <div
                  className="flex items-center md:order-2"
                  key={provider.name}
                >
                  <div className="relative mr-2">
                    <button
                      className="relative inline-flex items-center justify-center p-0.5 pr-2 mb-0  overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-btnColorDark to-btnColor group-hover:from-btnColorDark group-hover:to-btnColor hover:text-white  focus:ring-4 focus:outline-none focus:ring-purple-200 "
                      key={provider.name}
                      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                    >
                      <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white text-gray-700 rounded-md hover:text-gray-100 group-hover:bg-opacity-0">
                        <span className={preahvihear.className}>Sign In</span>
                      </span>

                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-4 h-4 ml-1"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                  <button
                    data-collapse-toggle="navbar-user"
                    type="button"
                    className="inline-flex items-center  p-2 w-10 h-10 justify-center text-sm  rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-headerText font-bold "
                    aria-controls="navbar-user"
                    aria-expanded={isMainMenuOpen}
                    onClick={toggleMainMenu}
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      className="w-10 h-10"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 17 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h15M1 7h15M1 13h15"
                      />
                    </svg>
                  </button>
                </div>
              ))}
          </>
        )}
        <div
          className={`items-center justify-between ${isMainMenuOpen ? "flex" : "hidden"
            } w-full md:flex md:w-auto md:order-1`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 w-full md:bg-white ">
            <li>
              <Link
                href={profileCompleted ? "/teams" : "/profile"}
                className="block py-2 pl-3 pr-4mx-2 font-bold text-xl text-headerText  navLinks"
                aria-current="page"
              >
                <span className={preahvihear.className}>My Team</span>
              </Link>
            </li>
            <li>
              <Link
                href="/teams/all"
                className="block py-2 pl-3 pr-4mx-2 font-bold text-xl text-headerText  navLinks"
              >
                <span className={preahvihear.className}>All Teams</span>
              </Link>
            </li>
            <li>
              <Link
                href="/#schedule"
                className="block py-2 pl-3 pr-4mx-2 font-bold text-xl text-headerText  navLinks"
              >
                <span className={preahvihear.className}>Schedule</span>
              </Link>
            </li>
            <li>
              <Link
                href="/teams/results"
                className="block py-2 pr-4 font-bold text-xl text-headerText  navLinks"
              >
                <span className={preahvihear.className}>Results</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
