// import React, { useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs";
// import * as poseDetection from "@tensorflow-models/pose-detection";
// import "@tensorflow/tfjs-backend-webgl";
// import axios from "axios";
// import { UserDatacontext } from "../../context/UserContext";
// import { useContext } from "react";
// // import "./App.css";

// const SQUAT_THRESHOLD = 90;
// const STAND_THRESHOLD = 170;
// const PUSHUP_DOWN_THRESHOLD = 100;
// const PUSHUP_UP_THRESHOLD = 160;
// const CONFIDENCE_THRESHOLD = 0.70;
// const STABILITY_FRAMES = 6;
// const COLOR = "aqua";

// function Aimodel() {
//   const [exercise, setExercise] = useState("squat");
//   const [count, setCount] = useState(0);
//   const [squats, setSquats ] = useState(0);
//   const [pushups, setpush] = useState(0);
//   const [isDown, setIsDown] = useState(false);
//   const [stabilityCounter, setStabilityCounter] = useState(0);
//   const [feedback, setFeedback] = useState("Start your exercise!");
//   const [videoLoaded, setVideoLoaded] = useState(false);
//   const [cameraStarted, setCameraStarted] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const { user } = useContext(UserDatacontext);

//   const canvasRef = useRef(null);
//   const videoRef = useRef(null);
//   const [detector, setDetector] = useState(null);

//   // Load the pose detection model
//   useEffect(() => {
//     const loadModel = async () => {
//       await tf.ready();
//       const model = await poseDetection.createDetector(
//         poseDetection.SupportedModels.BlazePose,
//         { runtime: "tfjs", enableSmoothing: true, modelType: "full" }
//       );
//       setDetector(model);
//     };
//     loadModel();
//   }, []);

//   // Handle video load event
//   const handleVideoLoad = () => {
//     console.log("Video has loaded and is ready to play.");
//     setVideoLoaded(true);
//   };

//   // Start Camera
//   const startCamera = async () => {
//     if (!videoRef.current) return;
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//       videoRef.current.play();
//       setCameraStarted(true);
//     } catch (error) {
//       console.error("Error accessing webcam:", error);
//     }
//   };

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       if (!isSaved) {
//         event.preventDefault();
//         event.returnValue = "You have unsaved changes! Save before leaving.";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [isSaved]);

//   useEffect(() => {
//     if (!videoRef.current) return;

//     const video = videoRef.current;

//     if (video.readyState >= 2) {
//       handleVideoLoad();
//     } else {
//       video.addEventListener("loadeddata", handleVideoLoad, { once: true });
//       video.addEventListener("error", () => console.error("Error loading video"));
//     }
//   }, []);

//   // Pose detection loop
//   useEffect(() => {
//     const detectPose = async () => {
//       if (detector && videoRef.current && videoLoaded) {
//         const video = videoRef.current;
//         const poses = await detector.estimatePoses(video);
//         if (poses.length > 0) {
//           const pose = poses[0];
//           drawPose(pose);
//           exercise === "squat" ? checkSquat(pose) : checkPushup(pose);
//         }
//       }
//     };

//     if (videoLoaded) {
//       const interval = setInterval(detectPose, 100);
//       return () => clearInterval(interval);
//     }
//   }, [detector, isDown, stabilityCounter, exercise, videoLoaded]);

//   const drawPose = (pose) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     pose.keypoints.forEach((point) => {
//       if (point.score > CONFIDENCE_THRESHOLD) {
//         ctx.beginPath();
//         ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
//         ctx.fillStyle = COLOR;
//         ctx.fill();
//       }
//     });
//   };

//   const checkSquat = (pose) => {
//     const keypoints = pose.keypoints;
//     const leftHip = keypoints.find((kp) => kp.name === "left_hip");
//     const leftKnee = keypoints.find((kp) => kp.name === "left_knee");
//     const leftAnkle = keypoints.find((kp) => kp.name === "left_ankle");
//     const rightHip = keypoints.find((kp) => kp.name === "right_hip");
//     const rightKnee = keypoints.find((kp) => kp.name === "right_knee");
//     const rightAnkle = keypoints.find((kp) => kp.name === "right_ankle");

//     if (leftHip && leftKnee && leftAnkle && rightHip && rightKnee && rightAnkle) {
//       const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
//       const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

//       const isNowSquatting = leftAngle < SQUAT_THRESHOLD && rightAngle < SQUAT_THRESHOLD;
//       const isNowStanding = leftAngle > STAND_THRESHOLD && rightAngle > STAND_THRESHOLD;

//       if (isNowSquatting) {
//         setFeedback("Hold the squat! Keep your back straight.");
//         setStabilityCounter((prev) => prev + 1);
//       } else {
//         setStabilityCounter(0);
//       }

//       if (stabilityCounter >= STABILITY_FRAMES && !isDown) {
//         setIsDown(true);
//       }

//       if (isNowStanding && isDown) {
//         setSquats((prevCount) => prevCount + 1);
//         setIsDown(false);
//         setFeedback("Great squat! Keep going.");
//       }
//     }
//   };

//   const checkPushup = (pose) => {
//     const keypoints = pose.keypoints;
//     const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
//     const leftElbow = keypoints.find((kp) => kp.name === "left_elbow");
//     const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
//     const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
//     const rightElbow = keypoints.find((kp) => kp.name === "right_elbow");
//     const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");

//     if (leftShoulder && leftElbow && leftWrist && rightShoulder && rightElbow && rightWrist) {
//       const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
//       const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

//       const isPushupDown = leftAngle < PUSHUP_DOWN_THRESHOLD && rightAngle < PUSHUP_DOWN_THRESHOLD;
//       const isPushupUp = leftAngle > PUSHUP_UP_THRESHOLD && rightAngle > PUSHUP_UP_THRESHOLD;

//       if (isPushupDown) {
//         setFeedback("Hold the push-up! Keep your body straight.");
//         setStabilityCounter((prev) => prev + 1);
//       } else {
//         setStabilityCounter(0);
//       }

//       if (stabilityCounter >= STABILITY_FRAMES && !isDown) {
//         setIsDown(true);
//       }

//       if (isPushupUp && isDown) {
//         setpush((prevCount) => prevCount + 1);
//         setIsDown(false);
//         setFeedback("Great push-up! Keep going.");
//       }
//     }
//   };

//   const calculateAngle = (pointA, pointB, pointC) => {
//     const vector1 = { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
//     const vector2 = { x: pointC.x - pointB.x, y: pointC.y - pointB.y };
//     const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
//     const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
//     const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);
//     const angle = Math.acos(dotProduct / (magnitude1 * magnitude2));
//     return (angle * 180) / Math.PI;
//   };

//   const saveProgress = async () => {

//     try {
//       await axios.post("http://localhost:5000/api/exercise/exercise", {
//         squats,
//         pushups,
//         id:user._id
//       }, { withCredentials: true }); // Ensure the backend receives user info

//       alert("Progress saved successfully!");
//       setpush(0);
//       setSquats(0);

//       setIsSaved(true);
//     } catch (error) {
//       console.error("Error saving progress:", error);
//       alert("Failed to save progress. Please try again.");
//     }
//   };

//   return (
//     <div className="App">
//       <h1>{exercise === "squat" ? "Squat Counter" : "Push-Up Counter"}</h1>
//       <button onClick={startCamera} disabled={cameraStarted}>
//         {cameraStarted ? "Camera Started" : "Start Camera"}
//       </button>
//       <button onClick={() => setExercise(exercise === "squat" ? "pushup" : "squat")}>
//         Switch to {exercise === "squat" ? "Push-Ups" : "Squats"}
//       </button>
//       <div>
//         <video ref={videoRef} width="640" height="480" autoPlay muted playsInline />
//         <canvas ref={canvasRef} width="640" height="480" />
//       </div>
//       <h2>Reps: {squats}</h2>
//       <h2>Reps: {pushups}</h2>
//       <h3 className="feedback">{feedback}</h3>
//       <button onClick={saveProgress} style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
//         Save Progress
//       </button>

//     </div>
//   );
// }

// export default Aimodel;

import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import axios from "axios";
import { UserDatacontext } from "../../context/UserContext";
import { useContext } from "react";
import "./Aimodel.css";
// import "./App.css";

const SQUAT_THRESHOLD = 90;
const STAND_THRESHOLD = 170;
const PUSHUP_DOWN_THRESHOLD = 100;
const PUSHUP_UP_THRESHOLD = 160;
const CONFIDENCE_THRESHOLD = 0.7;
const STABILITY_FRAMES = 6;
const COLOR = "aqua";

function Aimodel() {
  const [exercise, setExercise] = useState("squat");
  const [count, setCount] = useState(0);
  const [squats, setSquats] = useState(0);
  const [pushups, setpush] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [stabilityCounter, setStabilityCounter] = useState(0);
  const [feedback, setFeedback] = useState("Start your exercise!");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useContext(UserDatacontext);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [detector, setDetector] = useState(null);

  // Load the pose detection model
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const model = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        { runtime: "tfjs", enableSmoothing: true, modelType: "full" }
      );
      setDetector(model);
    };
    loadModel();
  }, []);

  // Handle video load event
  const handleVideoLoad = () => {
    console.log("Video has loaded and is ready to play.");
    setVideoLoaded(true);
  };

  // Start Camera
  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraStarted(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isSaved) {
        event.preventDefault();
        event.returnValue = "You have unsaved changes! Save before leaving.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSaved]);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (video.readyState >= 2) {
      handleVideoLoad();
    } else {
      video.addEventListener("loadeddata", handleVideoLoad, { once: true });
      video.addEventListener("error", () =>
        console.error("Error loading video")
      );
    }
  }, []);

  // Pose detection loop
  useEffect(() => {
    const detectPose = async () => {
      if (detector && videoRef.current && videoLoaded) {
        const video = videoRef.current;
        const poses = await detector.estimatePoses(video);
        if (poses.length > 0) {
          const pose = poses[0];
          drawPose(pose);
          exercise === "squat" ? checkSquat(pose) : checkPushup(pose);
        }
      }
    };

    if (videoLoaded) {
      const interval = setInterval(detectPose, 100);
      return () => clearInterval(interval);
    }
  }, [detector, isDown, stabilityCounter, exercise, videoLoaded]);

  const drawPose = (pose) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pose.keypoints.forEach((point) => {
      if (point.score > CONFIDENCE_THRESHOLD) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = COLOR;
        ctx.fill();
      }
    });
  };

  const checkSquat = (pose) => {
    const keypoints = pose.keypoints;
    const leftHip = keypoints.find((kp) => kp.name === "left_hip");
    const leftKnee = keypoints.find((kp) => kp.name === "left_knee");
    const leftAnkle = keypoints.find((kp) => kp.name === "left_ankle");
    const rightHip = keypoints.find((kp) => kp.name === "right_hip");
    const rightKnee = keypoints.find((kp) => kp.name === "right_knee");
    const rightAnkle = keypoints.find((kp) => kp.name === "right_ankle");

    if (
      leftHip &&
      leftKnee &&
      leftAnkle &&
      rightHip &&
      rightKnee &&
      rightAnkle
    ) {
      const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

      const isNowSquatting =
        leftAngle < SQUAT_THRESHOLD && rightAngle < SQUAT_THRESHOLD;
      const isNowStanding =
        leftAngle > STAND_THRESHOLD && rightAngle > STAND_THRESHOLD;

      if (isNowSquatting) {
        setFeedback("Hold the squat! Keep your back straight.");
        setStabilityCounter((prev) => prev + 1);
      } else {
        setStabilityCounter(0);
      }

      if (stabilityCounter >= STABILITY_FRAMES && !isDown) {
        setIsDown(true);
      }

      if (isNowStanding && isDown) {
        setSquats((prevCount) => prevCount + 1);
        setIsDown(false);
        setFeedback("Great squat! Keep going.");
      }
    }
  };

  const checkPushup = (pose) => {
    const keypoints = pose.keypoints;
    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
    const leftElbow = keypoints.find((kp) => kp.name === "left_elbow");
    const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
    const rightElbow = keypoints.find((kp) => kp.name === "right_elbow");
    const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");

    if (
      leftShoulder &&
      leftElbow &&
      leftWrist &&
      rightShoulder &&
      rightElbow &&
      rightWrist
    ) {
      const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

      const isPushupDown =
        leftAngle < PUSHUP_DOWN_THRESHOLD && rightAngle < PUSHUP_DOWN_THRESHOLD;
      const isPushupUp =
        leftAngle > PUSHUP_UP_THRESHOLD && rightAngle > PUSHUP_UP_THRESHOLD;

      if (isPushupDown) {
        setFeedback("Hold the push-up! Keep your body straight.");
        setStabilityCounter((prev) => prev + 1);
      } else {
        setStabilityCounter(0);
      }

      if (stabilityCounter >= STABILITY_FRAMES && !isDown) {
        setIsDown(true);
      }

      if (isPushupUp && isDown) {
        setpush((prevCount) => prevCount + 1);
        setIsDown(false);
        setFeedback("Great push-up! Keep going.");
      }
    }
  };

  const calculateAngle = (pointA, pointB, pointC) => {
    const vector1 = { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
    const vector2 = { x: pointC.x - pointB.x, y: pointC.y - pointB.y };
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
    const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);
    const angle = Math.acos(dotProduct / (magnitude1 * magnitude2));
    return (angle * 180) / Math.PI;
  };

  const saveProgress = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/exercise/exercise",
        {
          squats,
          pushups,
          id: user._id,
        },
        { withCredentials: true }
      ); // Ensure the backend receives user info

      alert("Progress saved successfully!");
      setpush(0);
      setSquats(0);

      setIsSaved(true);
    } catch (error) {
      console.error("Error saving progress:", error);
      alert("Failed to save progress. Please try again.");
    }
  };

  return (
    <div className="exercise-tracking-container">
      <div className="exercise-header">
        <h1>{exercise === "squat" ? "Squat Counter" : "Push-Up Counter"}</h1>
      </div>

      <div className="content-wrapper">
        <div className="video-section">
          <div className="camera-container">
            <video ref={videoRef} autoPlay muted playsInline />
            <canvas ref={canvasRef} className="video-overlay" />
          </div>

          <div className="controls-section">
            <button
              className="exercise-btn start-btn"
              onClick={startCamera}
              disabled={cameraStarted}
            >
              {cameraStarted ? "Camera Started" : "Start Camera"}
            </button>

            <button
              className="exercise-btn switch-btn"
              onClick={() =>
                setExercise(exercise === "squat" ? "pushup" : "squat")
              }
            >
              Switch to {exercise === "squat" ? "Push-Ups" : "Squats"}
            </button>
          </div>
        </div>

        <div className="stats-section">
          <div className="exercise-stats">
            <div className="stat-card">
              <h3>Squats: {squats}</h3>
            </div>
            <div className="stat-card">
              <h3>Push-ups: {pushups}</h3>
            </div>
          </div>

          <div className="feedback-section">
            <p className="feedback-text">{feedback}</p>
          </div>

          <button className="exercise-btn save-btn" onClick={saveProgress}>
            Save Progress
          </button>

          <div className="tutorial-section">
            <h3>
              How to perform {exercise === "squat" ? "Squats" : "Push-ups"}
            </h3>

            {/* Conditional rendering of video */}
            <video key={exercise} width="600" autoPlay loop muted playsInline>
              <source
                src={exercise === "squat" ? "/squat.mp4" : "/pushup.mp4"}
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aimodel;
