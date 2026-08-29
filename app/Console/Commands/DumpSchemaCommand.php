<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DumpSchemaCommand extends Command
{
    protected $signature = 'schema:dump-json {--path=docs/schema.json}';

    protected $description = 'Dump tables, columns and foreign keys to JSON (input for the ERD renderer)';

    /** Framework plumbing that would only clutter the diagram. */
    private const SKIP = [
        'migrations', 'cache', 'cache_locks', 'jobs', 'job_batches',
        'failed_jobs', 'sessions', 'password_reset_tokens',
    ];

    public function handle(): int
    {
        $database = DB::getDatabaseName();

        $tables = collect(DB::select('show tables'))
            ->map(fn ($row): string => array_values((array) $row)[0])
            ->reject(fn (string $table): bool => in_array($table, self::SKIP, true))
            ->values();

        $schema = [];

        foreach ($tables as $table) {
            $schema[$table] = [
                'cols' => DB::select(
                    'select COLUMN_NAME c, DATA_TYPE d, IS_NULLABLE n, COLUMN_KEY k
                     from information_schema.columns
                     where table_schema = ? and table_name = ?
                     order by ORDINAL_POSITION',
                    [$database, $table],
                ),
                'fks' => DB::select(
                    'select COLUMN_NAME c, REFERENCED_TABLE_NAME rt, REFERENCED_COLUMN_NAME rc
                     from information_schema.key_column_usage
                     where table_schema = ? and table_name = ?
                       and REFERENCED_TABLE_NAME is not null',
                    [$database, $table],
                ),
            ];
        }

        $path = base_path($this->option('path'));
        @mkdir(dirname($path), 0755, true);
        file_put_contents($path, json_encode($schema, JSON_PRETTY_PRINT));

        $this->info(sprintf(
            'Wrote %s (%d tables). Render it with: python docs/build-erd.py',
            $this->option('path'),
            count($schema),
        ));

        return self::SUCCESS;
    }
}
