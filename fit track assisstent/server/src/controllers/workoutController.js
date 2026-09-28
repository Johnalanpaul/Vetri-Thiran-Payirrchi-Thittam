/* =========================================================
   AI FITTRACK
   WORKOUT CONTROLLER
   ========================================================= */

const Workout = require("../models/Workout");


/* =========================================================
   1. ADD WORKOUT
   POST /api/workouts
   ========================================================= */

const addWorkout = async (req, res, next) => {

  try {

    /* -----------------------------------------------------
       Get workout data from request
       ----------------------------------------------------- */

    const {
      workoutName,
      category,
      duration,
      caloriesBurned,
      workoutDate
    } = req.body;


    /* -----------------------------------------------------
       Validate required fields
       ----------------------------------------------------- */

    if (
      !workoutName ||
      !category ||
      duration === undefined ||
      caloriesBurned === undefined
    ) {

      return res.status(400).json({
        success: false,
        error:
          "Please provide workoutName, category, duration, and caloriesBurned"
      });

    }


    /* -----------------------------------------------------
       Create workout
       ----------------------------------------------------- */

    const workout = await Workout.create({

      workoutName,

      category,

      duration: Number(duration),

      caloriesBurned: Number(caloriesBurned),

      workoutDate:
        workoutDate || new Date(),

      user: req.user._id

    });


    /* -----------------------------------------------------
       Send response
       ----------------------------------------------------- */

    res.status(201).json({

      success: true,

      data: workout

    });


  } catch (error) {

    next(error);

  }

};


/* =========================================================
   2. GET ALL WORKOUTS
   GET /api/workouts
   ========================================================= */

const getWorkouts = async (req, res, next) => {

  try {

    /* -----------------------------------------------------
       Read query parameters
       ----------------------------------------------------- */

    const {
      page = 1,
      limit = 10,
      category,
      from,
      to,
      sort = "-workoutDate"
    } = req.query;


    /* -----------------------------------------------------
       Create base query
       ----------------------------------------------------- */

    const query = {
      user: req.user._id
    };


    /* -----------------------------------------------------
       Filter by category
       ----------------------------------------------------- */

    if (category) {

      query.category = category;

    }


    /* -----------------------------------------------------
       Filter by date range
       ----------------------------------------------------- */

    if (from || to) {

      query.workoutDate = {};


      if (from) {

        query.workoutDate.$gte =
          new Date(from);

      }


      if (to) {

        const endDate =
          new Date(to);

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        query.workoutDate.$lte =
          endDate;

      }

    }


    /* -----------------------------------------------------
       Pagination
       ----------------------------------------------------- */

    const safeLimit =
      Math.min(
        Math.max(
          Number(limit) || 10,
          1
        ),
        50
      );


    const currentPage =
      Math.max(
        Number(page) || 1,
        1
      );


    const skip =
      (currentPage - 1) *
      safeLimit;


    /* -----------------------------------------------------
       Get workouts and total count
       ----------------------------------------------------- */

    const [
      data,
      total
    ] = await Promise.all([

      Workout
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(safeLimit),

      Workout.countDocuments(query)

    ]);


    /* -----------------------------------------------------
       Send response
       ----------------------------------------------------- */

    res.json({

      success: true,

      count: data.length,

      total,

      page: currentPage,

      pages:
        Math.ceil(
          total / safeLimit
        ),

      data

    });


  } catch (error) {

    next(error);

  }

};


/* =========================================================
   3. GET WORKOUT BY ID
   GET /api/workouts/:id
   ========================================================= */

const getWorkoutById = async (
  req,
  res,
  next
) => {

  try {

    /* -----------------------------------------------------
       Find workout belonging to current user
       ----------------------------------------------------- */

    const workout =
      await Workout.findOne({

        _id: req.params.id,

        user: req.user._id

      });


    /* -----------------------------------------------------
       Workout not found
       ----------------------------------------------------- */

    if (!workout) {

      return res.status(404).json({

        success: false,

        error: "Workout not found"

      });

    }


    /* -----------------------------------------------------
       Send workout
       ----------------------------------------------------- */

    res.json({

      success: true,

      data: workout

    });


  } catch (error) {

    next(error);

  }

};


/* =========================================================
   4. UPDATE WORKOUT
   PUT /api/workouts/:id
   ========================================================= */

const updateWorkout = async (
  req,
  res,
  next
) => {

  try {

    /* -----------------------------------------------------
       Allowed fields
       ----------------------------------------------------- */

    const allowedFields = {};


    const allowedKeys = [

      "workoutName",

      "category",

      "duration",

      "caloriesBurned",

      "workoutDate"

    ];


    /* -----------------------------------------------------
       Copy only allowed fields
       ----------------------------------------------------- */

    allowedKeys.forEach((key) => {

      if (
        req.body[key] !== undefined
      ) {

        allowedFields[key] =
          req.body[key];

      }

    });


    /* -----------------------------------------------------
       Update workout
       ----------------------------------------------------- */

    const workout =
      await Workout.findOneAndUpdate(

        {
          _id: req.params.id,

          user: req.user._id

        },

        allowedFields,

        {
          new: true,

          runValidators: true

        }

      );


    /* -----------------------------------------------------
       Workout not found
       ----------------------------------------------------- */

    if (!workout) {

      return res.status(404).json({

        success: false,

        error: "Workout not found"

      });

    }


    /* -----------------------------------------------------
       Send updated workout
       ----------------------------------------------------- */

    res.json({

      success: true,

      data: workout

    });


  } catch (error) {

    next(error);

  }

};


/* =========================================================
   5. DELETE WORKOUT
   DELETE /api/workouts/:id
   ========================================================= */

const deleteWorkout = async (
  req,
  res,
  next
) => {

  try {

    /* -----------------------------------------------------
       Delete workout belonging to current user
       ----------------------------------------------------- */

    const workout =
      await Workout.findOneAndDelete({

        _id: req.params.id,

        user: req.user._id

      });


    /* -----------------------------------------------------
       Workout not found
       ----------------------------------------------------- */

    if (!workout) {

      return res.status(404).json({

        success: false,

        error: "Workout not found"

      });

    }


    /* -----------------------------------------------------
       Send success response
       ----------------------------------------------------- */

    res.json({

      success: true,

      message:
        "Workout removed successfully"

    });


  } catch (error) {

    next(error);

  }

};


/* =========================================================
   6. SEARCH WORKOUTS
   GET /api/workouts/search
   ========================================================= */

const searchWorkouts = async (
  req,
  res,
  next
) => {

  try {

    /* -----------------------------------------------------
       Get search parameters
       ----------------------------------------------------- */

    const {
      q,
      category
    } = req.query;


    /* -----------------------------------------------------
       Validate search parameters
       ----------------------------------------------------- */

    if (!q && !category) {

      return res.status(400).json({

        success: false,

        error:
          "Provide q or category"

      });

    }


    /* -----------------------------------------------------
       Build search conditions
       ----------------------------------------------------- */

    const conditions = [];


    /* -----------------------------------------------------
       Search by workout name/category
       ----------------------------------------------------- */

    if (q) {

      conditions.push({

        $or: [

          {
            workoutName: {
              $regex: q,
              $options: "i"
            }
          },

          {
            category: {
              $regex: q,
              $options: "i"
            }
          }

        ]

      });

    }


    /* -----------------------------------------------------
       Base user query
       ----------------------------------------------------- */

    const query = {

      $and: [

        {
          user: req.user._id
        },

        ...(
          conditions.length
            ? conditions
            : []
        )

      ]

    };


    /* -----------------------------------------------------
       Add category filter
       ----------------------------------------------------- */

    if (category) {

      query.$and.push({

        category

      });

    }


    /* -----------------------------------------------------
       Search database
       ----------------------------------------------------- */

    const data =
      await Workout
        .find(query)
        .sort({
          workoutDate: -1
        });


    /* -----------------------------------------------------
       Send response
       ----------------------------------------------------- */

    res.json({

      success: true,

      count: data.length,

      data

    });


  } catch (error) {

    next(error);

  }

};


/* =========================================================
   7. EXPORT CONTROLLERS
   ========================================================= */

module.exports = {

  addWorkout,

  getWorkouts,

  getWorkoutById,

  updateWorkout,

  deleteWorkout,

  searchWorkouts

};