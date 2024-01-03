-- Create sample users with application form answers for a given campaign
DO $$
DECLARE 
    campaignIdInput TEXT := 'clq5leesv0003zfife73d74hu'; -- Change this to whatever your campaign id is
    newUserId1 UUID := gen_random_uuid();
    newUserId2 UUID := gen_random_uuid();
    newUserId3 UUID := gen_random_uuid();
    userIds UUID[] := ARRAY[newUserId1, newUserId2, newUserId3];
    formId TEXT;
    questionRecord RECORD;
    newFormResponseId TEXT;
    answerValue JSON;
    userId TEXT;
BEGIN
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    INSERT INTO "User" (id, name, email, "createdAt", "updatedAt") VALUES (newUserId1, 'User 1', 'user1@example.com', now(), now());
    INSERT INTO "User" (id, name, email, "createdAt", "updatedAt") VALUES (newUserId2, 'User 2', 'user2@example.com', now(), now());
    INSERT INTO "User" (id, name, email, "createdAt", "updatedAt") VALUES (newUserId3, 'User 3', 'user3@example.com', now(), now());

    SELECT "formId" INTO formId FROM "Campaign" WHERE id = campaignIdInput;

    FOR i IN 1..array_length(userIds, 1) LOOP
        userId := userIds[i];
        INSERT INTO "FormResponse" (id, "userId", "formId", "createdAt", "updatedAt") VALUES (gen_random_uuid(), userId, formId, now(), now()) RETURNING id INTO newFormResponseId;

        FOR questionRecord IN SELECT * FROM "Question" WHERE "formId" = formId LOOP
            IF questionRecord.type = 'DATE' THEN
                answerValue := '"2023-12-12T05:00:00.000Z"';
            ELSIF questionRecord.type = 'DATE_RANGE' THEN
                answerValue := '{"to": "2024-01-25T05:00:00.000Z", "from": "2024-01-16T05:00:00.000Z"}';
            ELSE
                answerValue := '"Sample Answer Content"';
            END IF;

            INSERT INTO "Answer" (id, "value", "questionId", "answersId") 
            VALUES (gen_random_uuid(), answerValue, questionRecord.id, newFormResponseId);
        END LOOP;

        INSERT INTO "CampaignApplication" (id, "userId", "campaignId") VALUES (gen_random_uuid(), userId, campaignIdInput);
    END LOOP;
END $$;