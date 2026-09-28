/* =========================================================
   AI FITTRACK
   DASHBOARD CONTROLLER
   ========================================================= */

const Workout = require("../models/Workout");


/* =========================================================
   1. GET DASHBOARD
   ========================================================= */

const getDashboard = async (req, res, next) => {

  try {

    /* -----------------------------------------------------
       Get authenticated user ID
       ----------------------------------------------------- */

    const userId = req.user._id;


    /* -----------------------------------------------------
       Get user's workouts
       ----------------------------------------------------- */

    const workouts = await Workout
      .find({ user: userId })
      .sort({ workoutDate: -1 })
      .lean();


    /* =====================================================
       2. BASIC WORKOUT STATISTICS
       ===================================================== */

    const totalWorkouts = workouts.length;


    const totalDuration = workouts.reduce(
      (sum, workout) => {
        return sum + Number(workout.duration || 0);
      },
      0
    );


    const totalCalories = workouts.reduce(
      (sum, workout) => {
        return sum + Number(workout.caloriesBurned || 0);
      },
      0
    );


    const averageDuration = totalWorkouts
      ? Math.round(
          totalDuration / totalWorkouts
        )
      : 0;


    /* =====================================================
       3. WORKOUT CATEGORY STATISTICS
       ===================================================== */

    const categories = {};


    workouts.forEach((workout) => {

      const category = workout.category;

      categories[category] =
        (categories[category] || 0) + 1;

    });


    /* =====================================================
       4. WEEKLY WORKOUT STATISTICS
       ===================================================== */

    const weekly = Array.from(
      { length: 7 },
      (_, index) => {

        /* -----------------------------------------------
           Calculate current day
           ----------------------------------------------- */

        const date = new Date();

        date.setHours(
          0,
          0,
          0,
          0
        );


        date.setDate(
          date.getDate() -
          (6 - index)
        );


        /* -----------------------------------------------
           Calculate next day
           ----------------------------------------------- */

        const nextDate = new Date(date);

        nextDate.setDate(
          nextDate.getDate() + 1
        );


        /* -----------------------------------------------
           Find workouts for this day
           ----------------------------------------------- */

        const dailyWorkouts =
          workouts.filter(
            (workout) => {

              const workoutDate =
                new Date(
                  workout.workoutDate
                );

              return (
                workoutDate >= date &&
                workoutDate < nextDate
              );

            }
          );


        /* -----------------------------------------------
           Calculate daily statistics
           ----------------------------------------------- */

        const dailyDuration =
          dailyWorkouts.reduce(
            (sum, workout) => {

              return (
                sum +
                Number(
                  workout.duration || 0
                )
              );

            },
            0
          );


        const dailyCalories =
          dailyWorkouts.reduce(
            (sum, workout) => {

              return (
                sum +
                Number(
                  workout.caloriesBurned || 0
                )
              );

            },
            0
          );


        /* -----------------------------------------------
           Return daily data
           ----------------------------------------------- */

        return {

          date: date
            .toISOString()
            .slice(0, 10),

          workouts:
            dailyWorkouts.length,

          duration:
            dailyDuration,

          calories:
            dailyCalories

        };

      }
    );


    /* =====================================================
       5. WORKOUT STREAK
       ===================================================== */

    const daySet = new Set(

      workouts.map(
        (workout) => {

          return new Date(
            workout.workoutDate
          )
            .toISOString()
            .slice(0, 10);

        }
      )

    );


    let streak = 0;


    const cursor = new Date();

    cursor.setHours(
      0,
      0,
      0,
      0
    );


    while (
      daySet.has(
        cursor
          .toISOString()
          .slice(0, 10)
      )
    ) {

      streak++;

      cursor.setDate(
        cursor.getDate() - 1
      );

    }


    /* =====================================================
       6. RECENT WORKOUTS
       ===================================================== */

    const recent =
      workouts.slice(0, 5);


    /* =====================================================
       7. DASHBOARD RESPONSE
       ===================================================== */

    res.json({

      success: true,

      data: {

        totalWorkouts,

        totalDuration,

        totalCalories,

        averageDuration,

        streak,

        categories,

        weekly,

        recent

      }

    });


  } catch (error) {

    /* -----------------------------------------------------
       Pass error to centralized error handler
       ----------------------------------------------------- */

    next(error);

  }

};


/* =========================================================
   8. EXPORT CONTROLLER
   ========================================================= */

module.exports = {
  getDashboard
};