const pool = require('../utils/pool');

module.exports = class Log {
    id;
    notes;
    rating;
    recipeId;
    dateOfEvent;
    constructor(row) {
        this.id = String(row.id);
        this.notes = row.notes;
        this.rating = row.rating;
        this.recipeId = String(row.recipe_id);
        this.dateOfEvent = row.date_of_event

    }

    static async insert(log) {
        const { rows } = await pool.query(
            'INSERT into logs (notes, rating, recipe_id, date_of_event) VALUES ($1, $2, $3, $4) RETURNING *',
            [log.notes, log.rating, log.recipeId, log.dateOfEvent]
        );

        return new Log(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query(
            'SELECT * FROM logs'
        );

        return rows.map(row => new Log(row));
    }

    static async findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM logs WHERE id=$1',
            [id]
        );

        if (!rows[0]) throw new Error(`log with id ${id} not found`);
        else return new Log(rows[0]);
    }

    static async update(id, log) {
        const { rows } = await pool.query(
            `UPDATE logs
       SET  notes=$1,
            rating=$2,
            recipe_id=$3,
            date_of_event=$4
       WHERE id=$5
       RETURNING *
      `,
            [log.notes, log.rating, log.recipeId, log.dateOfEvent, id]
        );

        if (!rows[0]) throw new Error(`log with id ${id} not found`);
        else return new Log(rows[0]);
    }

    static async delete(id) {
        const { rows } = await pool.query(
            'DELETE FROM logs WHERE id=$1 RETURNING *',
            [id]
        );

        if (!rows[0]) throw new Error(`log with id ${id} not found`);
        else return new Log(rows[0]);
    }
};
